package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nqvinh00/colorscheme/models"
	"github.com/nqvinh00/colorscheme/repository"
	"github.com/rs/zerolog"
)

type colorSchemeHandler struct {
	colorSchemeRepo repository.ColorSchemeRepository
	log             zerolog.Logger
}

func NewColorSchemeHandler(colorSchemeRepo repository.ColorSchemeRepository, log zerolog.Logger) *colorSchemeHandler {
	return &colorSchemeHandler{
		colorSchemeRepo: colorSchemeRepo,
		log:             log,
	}
}

func (h *colorSchemeHandler) GetAllColorSchemesByAuthor(c *gin.Context) {
	username, ok := c.Get("username")
	if !ok {
		c.JSON(http.StatusUnauthorized, models.Response{
			Message: "Unauthorized",
			Code:    http.StatusUnauthorized,
		})
		return
	}
	colorSchemes, err := h.colorSchemeRepo.GetByAuthor(username.(string))
	if err != nil {
		h.log.Error().Err(err).Str("username", username.(string)).Msg("Failed to get all color schemes")
		c.JSON(http.StatusInternalServerError, models.Response{
			Message: "Failed to get all color schemes",
			Code:    http.StatusInternalServerError,
		})
		return
	}

	if len(colorSchemes) == 0 {
		colorSchemes = []models.ColorScheme{}
	}

	c.JSON(http.StatusOK, models.Response{
		Message: "Success",
		Code:    http.StatusOK,
		Data:    colorSchemes,
	})
}

func (h *colorSchemeHandler) GetColorSchemeById(c *gin.Context) {
	id := c.Param("id")
	colorScheme, err := h.colorSchemeRepo.GetById(id)
	if err != nil {
		h.log.Error().Err(err).Str("id", id).Msg("Failed to get color scheme")
		c.JSON(http.StatusInternalServerError, models.Response{
			Message: "Failed to get color scheme",
			Code:    http.StatusInternalServerError,
		})
		return
	}

	if colorScheme == nil {
		c.JSON(http.StatusNotFound, models.Response{
			Message: "Color scheme not found",
			Code:    http.StatusNotFound,
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Message: "Success",
		Code:    http.StatusOK,
		Data:    colorScheme,
	})
}

func (h *colorSchemeHandler) CreateColorScheme(c *gin.Context) {
	var colorScheme models.ColorScheme
	if err := c.ShouldBindJSON(&colorScheme); err != nil {
		h.log.Error().Err(err).Msg("Failed to create color scheme")
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Failed to create color scheme",
			Code:    http.StatusBadRequest,
		})
		return
	}

	err := h.colorSchemeRepo.Create(colorScheme)
	if err != nil {
		h.log.Error().Err(err).Msg("Failed to create color scheme")
		c.JSON(http.StatusInternalServerError, models.Response{
			Message: "Failed to create color scheme",
			Code:    http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Message: "Success",
		Code:    http.StatusOK,
		Data:    colorScheme,
	})
}
