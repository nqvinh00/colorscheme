package services

import (
	"context"
	"errors"

	"github.com/nqvinh00/colorscheme/models"
	"github.com/nqvinh00/colorscheme/repository"
	"github.com/rs/zerolog"
)

type ColorSchemeService interface {
	GetAllColorSchemesByAuthor(ctx context.Context, author string) ([]models.ColorScheme, error)
	GetColorSchemeById(ctx context.Context, id string) (*models.ColorScheme, error)
	CreateColorScheme(ctx context.Context, colorScheme models.ColorScheme) error
	UpdateColorScheme(ctx context.Context, colorScheme models.ColorScheme) error
	DeleteColorScheme(ctx context.Context, id string) error
}

type colorSchemeService struct {
	colorSchemeRepo repository.ColorSchemeRepository
	log             zerolog.Logger
}

func NewColorSchemeService(colorSchemeRepo repository.ColorSchemeRepository, log zerolog.Logger) ColorSchemeService {
	return &colorSchemeService{
		colorSchemeRepo: colorSchemeRepo,
		log:             log,
	}
}

func (s *colorSchemeService) GetAllColorSchemesByAuthor(ctx context.Context, author string) ([]models.ColorScheme, error) {
	colorSchemes, err := s.colorSchemeRepo.GetByAuthor(ctx, author)
	if err != nil {
		s.log.Error().Err(err).Str("author", author).Msg("Failed to get all color schemes")
		return nil, err
	}

	if len(colorSchemes) == 0 {
		colorSchemes = []models.ColorScheme{}
	}

	return colorSchemes, nil
}

func (s *colorSchemeService) GetColorSchemeById(ctx context.Context, id string) (*models.ColorScheme, error) {
	colorScheme, err := s.colorSchemeRepo.GetById(ctx, id)
	if err != nil {
		s.log.Error().Err(err).Str("id", id).Msg("Failed to get color scheme")
		return nil, err
	}

	if colorScheme == nil {
		return nil, errors.New("color scheme not found")
	}

	return colorScheme, nil
}

func (s *colorSchemeService) CreateColorScheme(ctx context.Context, colorScheme models.ColorScheme) error {
	if err := s.colorSchemeRepo.Create(ctx, colorScheme); err != nil {
		s.log.Error().Err(err).Msg("Failed to create color scheme")
		return err
	}

	return nil
}

func (s *colorSchemeService) UpdateColorScheme(ctx context.Context, colorScheme models.ColorScheme) error {
	if err := s.colorSchemeRepo.Update(ctx, colorScheme); err != nil {
		s.log.Error().Err(err).Msg("Failed to update color scheme")
		return err
	}

	return nil
}

func (s *colorSchemeService) DeleteColorScheme(ctx context.Context, id string) error {
	if err := s.colorSchemeRepo.Delete(ctx, id); err != nil {
		s.log.Error().Err(err).Str("id", id).Msg("Failed to delete color scheme")
		return err
	}

	return nil
}
