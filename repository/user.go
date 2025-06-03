package repository

import "database/sql"

type UserRepository interface {
	CreateAccount(username, password string) error
	Login(username string, hashed *string) error
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) CreateAccount(username, password string) error {
	_, err := r.db.Exec("INSERT INTO users (username, password) VALUES ($1, $2)", username, password)
	return err
}

func (r *userRepository) Login(username string, hashed *string) error {
	return r.db.QueryRow("SELECT password FROM users WHERE username = $1", username).Scan(hashed)
}
