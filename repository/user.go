package repository

import (
	"context"
	"database/sql"
)

type UserRepository interface {
	CreateAccount(ctx context.Context, username, password string) error
	Login(ctx context.Context, username string, hashed *string) error
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) CreateAccount(ctx context.Context, username, password string) error {
	_, err := r.db.ExecContext(ctx, "INSERT INTO users (username, password) VALUES ($1, $2)", username, password)
	return err
}

func (r *userRepository) Login(ctx context.Context, username string, hashed *string) error {
	return r.db.QueryRowContext(ctx, "SELECT password FROM users WHERE username = $1", username).Scan(hashed)
}
