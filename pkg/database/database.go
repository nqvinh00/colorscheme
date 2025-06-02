package database

import (
	"database/sql"
	"time"

	"github.com/nqvinh00/colorscheme/pkg/config"

	_ "github.com/mattn/go-sqlite3"
)

func InitDBConnection(cfg config.DBConfig) (*sql.DB, error) {
	db, err := sql.Open("sqlite3", cfg.Path)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(cfg.MaxOpenConns)
	db.SetMaxIdleConns(cfg.MaxIdleConns)
	db.SetConnMaxLifetime(time.Duration(cfg.ConnMaxLifetime) * time.Minute)

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`)
	if err != nil {
		return nil, err
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS color_schemes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL
);`)
	if err != nil {
		return nil, err
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS color_scheme_colors (
    scheme_id TEXT NOT NULL,
    color_key TEXT NOT NULL,
    color_value TEXT NOT NULL,
    PRIMARY KEY (scheme_id, color_key)
	FOREIGN KEY (scheme_id) REFERENCES color_schemes(id) ON DELETE CASCADE
);`)
	if err != nil {
		return nil, err
	}

	return db, nil
}
