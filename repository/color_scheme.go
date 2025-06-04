package repository

import (
	"context"
	"database/sql"

	"github.com/nqvinh00/colorscheme/models"
)

type ColorSchemeRepository interface {
	GetByAuthor(ctx context.Context, author string) ([]models.ColorScheme, error)
	GetById(ctx context.Context, id string) (*models.ColorScheme, error)
	Create(ctx context.Context, scheme models.ColorScheme) error
	Update(ctx context.Context, scheme models.ColorScheme) error
	Delete(ctx context.Context, id string) error
}

type colorSchemeRepository struct {
	db *sql.DB
}

func NewColorSchemeRepository(db *sql.DB) ColorSchemeRepository {
	return &colorSchemeRepository{db: db}
}

func (r *colorSchemeRepository) GetByAuthor(ctx context.Context, author string) ([]models.ColorScheme, error) {
	rows, err := r.db.QueryContext(ctx, "SELECT id, name, author, category FROM color_schemes WHERE author = $1", author)
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
		colorRows, err := r.db.Query("SELECT color_key, color_value FROM color_scheme_colors WHERE scheme_id = $1", s.ID)
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

func (r *colorSchemeRepository) GetById(ctx context.Context, id string) (*models.ColorScheme, error) {
	rows := r.db.QueryRowContext(ctx, "SELECT id, name, author, category FROM color_schemes WHERE id = $1", id)

	var scheme models.ColorScheme
	if err := rows.Scan(&scheme.ID, &scheme.Name, &scheme.Author, &scheme.Category); err != nil {
		return nil, err
	}

	// Load colors for this scheme
	colorRows, err := r.db.QueryContext(ctx, "SELECT color_key, color_value FROM color_scheme_colors WHERE scheme_id = $1", scheme.ID)
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

func (r *colorSchemeRepository) Create(ctx context.Context, scheme models.ColorScheme) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	_, err = tx.ExecContext(ctx, "INSERT INTO color_schemes (id, name, author, category) VALUES ($1, $2, $3, $4)", scheme.ID, scheme.Name, scheme.Author, scheme.Category)
	if err != nil {
		tx.Rollback()
		return err
	}
	for key, value := range scheme.Colors {
		_, err := tx.ExecContext(ctx, "INSERT INTO color_scheme_colors (scheme_id, color_key, color_value) VALUES ($1, $2, $3)", scheme.ID, key, value)
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit()
}

func (r *colorSchemeRepository) Update(ctx context.Context, scheme models.ColorScheme) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	_, err = tx.ExecContext(ctx, "UPDATE color_schemes SET name = $1, author = $2, category = $3 WHERE id = $4", scheme.Name, scheme.Author, scheme.Category, scheme.ID)
	if err != nil {
		tx.Rollback()
		return err
	}
	// Remove old colors
	_, err = tx.ExecContext(ctx, "DELETE FROM color_scheme_colors WHERE scheme_id = $1", scheme.ID)
	if err != nil {
		tx.Rollback()
		return err
	}
	// Insert new colors
	for key, value := range scheme.Colors {
		_, err := tx.ExecContext(ctx, "INSERT INTO color_scheme_colors (scheme_id, color_key, color_value) VALUES ($1, $2, $3)", scheme.ID, key, value)
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit()
}

func (r *colorSchemeRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM color_schemes WHERE id = $1", id)
	return err
}
