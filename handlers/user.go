package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nqvinh00/colorscheme/models"
	"github.com/nqvinh00/colorscheme/services"
	"golang.org/x/crypto/bcrypt"
)

type userHandler struct {
	userService services.UserService
}

func NewUserHandler(userService services.UserService) *userHandler {
	return &userHandler{
		userService: userService,
	}
}

// CreateAccount handles user registration
func (h *userHandler) CreateAccount(c *gin.Context) {
	var req models.AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Invalid request",
			Code:    http.StatusBadRequest,
		})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Message: "Failed to hash password",
			Code:    http.StatusInternalServerError,
		})
		return
	}

	token, err := h.userService.CreateAccount(c.Request.Context(), req.Username, string(hashed))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Message: "Failed to create account",
			Code:    http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"token": token})
}

// Login handles user authentication
func (h *userHandler) Login(c *gin.Context) {
	var req models.AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Invalid request",
			Code:    http.StatusBadRequest,
		})
		return
	}

	token, err := h.userService.Login(c.Request.Context(), req.Username, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, models.Response{
			Message: "Invalid username or password",
			Code:    http.StatusUnauthorized,
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Message: "Login successful",
		Code:    http.StatusOK,
		Data:    token,
	})
}
