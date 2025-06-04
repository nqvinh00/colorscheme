package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nqvinh00/colorscheme/models"
	"github.com/nqvinh00/colorscheme/services"
)

type colorSchemeHandler struct {
	colorSchemeService services.ColorSchemeService
}

func NewColorSchemeHandler(colorSchemeService services.ColorSchemeService) *colorSchemeHandler {
	return &colorSchemeHandler{
		colorSchemeService: colorSchemeService,
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

	colorSchemes, err := h.colorSchemeService.GetAllColorSchemesByAuthor(c.Request.Context(), username.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Message: "Failed to get all color schemes",
			Code:    http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Message: "Success",
		Code:    http.StatusOK,
		Data:    colorSchemes,
	})
}

func (h *colorSchemeHandler) GetColorSchemeById(c *gin.Context) {
	id := c.Param("id")
	colorScheme, err := h.colorSchemeService.GetColorSchemeById(c.Request.Context(), id)
	if err != nil {
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
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Invalid request",
			Code:    http.StatusBadRequest,
		})
		return
	}

	if err := h.colorSchemeService.CreateColorScheme(c.Request.Context(), colorScheme); err != nil {
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

func (h *colorSchemeHandler) UpdateColorScheme(c *gin.Context) {
	var colorScheme models.ColorScheme
	if err := c.ShouldBindJSON(&colorScheme); err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Invalid request",
			Code:    http.StatusBadRequest,
		})
		return
	}

	if err := h.colorSchemeService.UpdateColorScheme(c.Request.Context(), colorScheme); err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Message: "Failed to update color scheme",
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

func (h *colorSchemeHandler) DeleteColorScheme(c *gin.Context) {
	id := c.Param("id")
	if err := h.colorSchemeService.DeleteColorScheme(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Message: "Failed to delete color scheme",
			Code:    http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Message: "Success",
		Code:    http.StatusOK,
	})
}
