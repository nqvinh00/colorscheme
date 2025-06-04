package services

import (
	"context"
	"errors"
	"strings"

	"github.com/nqvinh00/colorscheme/pkg/utils"
	"github.com/nqvinh00/colorscheme/repository"

	"github.com/rs/zerolog"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	Login(ctx context.Context, username, password string) (string, error)
	CreateAccount(ctx context.Context, username, password string) (string, error)
}

type userService struct {
	userRepo  repository.UserRepository
	log       zerolog.Logger
	secretKey string
}

func NewUserService(userRepo repository.UserRepository, log zerolog.Logger, secretKey string) UserService {
	return &userService{
		userRepo:  userRepo,
		log:       log,
		secretKey: secretKey,
	}
}

func (s *userService) Login(ctx context.Context, username, password string) (string, error) {
	var hashed string
	if err := s.userRepo.Login(ctx, username, &hashed); err != nil {
		s.log.Error().Str("username", username).Err(err).Msg("Failed to login")
		return "", err
	}

	if bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password)) != nil {
		s.log.Error().Str("username", username).Msg("Invalid password")
		return "", errors.New("invalid password")
	}

	token, err := utils.GenerateToken(username, s.secretKey)
	if err != nil {
		s.log.Error().Str("username", username).Err(err).Msg("Failed to generate token")
		return "", err
	}

	return token, nil
}

func (s *userService) CreateAccount(ctx context.Context, username, password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		s.log.Error().Str("username", username).Err(err).Msg("Failed to hash password")
		return "", err
	}

	s.log.Info().Str("username", username).Msg("Creating account")
	if err := s.userRepo.CreateAccount(ctx, username, string(hashed)); err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed") {
			return "", errors.New("user already exists")
		}

		s.log.Error().Str("username", username).Err(err).Msg("Failed to create user")
		return "", err

	}

	token, err := utils.GenerateToken(username, s.secretKey)
	if err != nil {
		s.log.Error().Str("username", username).Err(err).Msg("Failed to generate token")
		return "", err
	}

	return token, nil
}
