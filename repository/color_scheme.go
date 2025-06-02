package repository

import (
	"database/sql"

	"github.com/nqvinh00/colorscheme/models"
)

type ColorSchemeRepository interface {
	GetByAuthor(author string) ([]models.ColorScheme, error)
	GetById(id string) (*models.ColorScheme, error)
	Create(scheme models.ColorScheme) error
	Update(scheme models.ColorScheme) error
	Delete(id string) error
}

type colorSchemeRepository struct {
	db *sql.DB
}

func NewColorSchemeRepository(db *sql.DB) ColorSchemeRepository {
	return &colorSchemeRepository{db: db}
}

func (r *colorSchemeRepository) GetByAuthor(author string) ([]models.ColorScheme, error) {
	rows, err := r.db.Query("SELECT id, name, author, category FROM color_schemes WHERE author = ?", author)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var schemes []models.ColorScheme
	for rows.Next() {
		var s models.ColorScheme
		if err := rows.Scan(&s.ID, &s.Name, &s.Author, &s.Category); err != nil {
			return nil, err
		}
		// Load colors for this scheme
		colorRows, err := r.db.Query("SELECT color_key, color_value FROM color_scheme_colors WHERE scheme_id = ?", s.ID)
		if err != nil {
			return nil, err
		}
		s.Colors = make(map[string]string)
		for colorRows.Next() {
			var key, value string
			if err := colorRows.Scan(&key, &value); err != nil {
				colorRows.Close()
				return nil, err
			}
			s.Colors[key] = value
		}
		colorRows.Close()
		schemes = append(schemes, s)
	}
	return schemes, nil
}

func (r *colorSchemeRepository) GetById(id string) (*models.ColorScheme, error) {
	rows, err := r.db.Query("SELECT id, name, author, category FROM color_schemes WHERE id = ?", id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var scheme models.ColorScheme
	if !rows.Next() {
		return nil, nil
	}
	if err := rows.Scan(&scheme.ID, &scheme.Name, &scheme.Author, &scheme.Category); err != nil {
		return nil, err
	}
	// Load colors for this scheme
	colorRows, err := r.db.Query("SELECT color_key, color_value FROM color_scheme_colors WHERE scheme_id = ?", scheme.ID)
	if err != nil {
		return nil, err
	}
	scheme.Colors = make(map[string]string)
	for colorRows.Next() {
		var key, value string
		if err := colorRows.Scan(&key, &value); err != nil {
			colorRows.Close()
			return nil, err
		}
		scheme.Colors[key] = value
	}
	colorRows.Close()
	return &scheme, nil
}

func (r *colorSchemeRepository) Create(scheme models.ColorScheme) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	_, err = tx.Exec("INSERT INTO color_schemes (id, name, author, category) VALUES (?, ?, ?, ?)", scheme.ID, scheme.Name, scheme.Author, scheme.Category)
	if err != nil {
		tx.Rollback()
		return err
	}
	for key, value := range scheme.Colors {
		_, err := tx.Exec("INSERT INTO color_scheme_colors (scheme_id, color_key, color_value) VALUES (?, ?, ?)", scheme.ID, key, value)
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit()
}

func (r *colorSchemeRepository) Update(scheme models.ColorScheme) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	_, err = tx.Exec("UPDATE color_schemes SET name = ?, author = ?, category = ? WHERE id = ?", scheme.Name, scheme.Author, scheme.Category, scheme.ID)
	if err != nil {
		tx.Rollback()
		return err
	}
	// Remove old colors
	_, err = tx.Exec("DELETE FROM color_scheme_colors WHERE scheme_id = ?", scheme.ID)
	if err != nil {
		tx.Rollback()
		return err
	}
	// Insert new colors
	for key, value := range scheme.Colors {
		_, err := tx.Exec("INSERT INTO color_scheme_colors (scheme_id, color_key, color_value) VALUES (?, ?, ?)", scheme.ID, key, value)
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit()
}

func (r *colorSchemeRepository) Delete(id string) error {
	_, err := r.db.Exec("DELETE FROM color_schemes WHERE id = ?", id)
	return err
}
