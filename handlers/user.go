package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/nqvinh00/colorscheme/models"
	"github.com/nqvinh00/colorscheme/pkg/utils"
	"github.com/nqvinh00/colorscheme/repository"
	"github.com/rs/zerolog"
	"golang.org/x/crypto/bcrypt"
)

type userHandler struct {
	userRepo  repository.UserRepository
	log       zerolog.Logger
	secretKey string
}

func NewUserHandler(userRepo repository.UserRepository, secretKey string, log zerolog.Logger) *userHandler {
	return &userHandler{
		userRepo:  userRepo,
		secretKey: secretKey,
		log:       log,
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

	h.log.Info().Msgf("Creating account for user: %s", req.Username)

	err = h.userRepo.CreateAccount(req.Username, string(hashed))
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed") {
			c.JSON(http.StatusConflict, models.Response{
				Message: "User already exists",
				Code:    http.StatusConflict,
			})
		} else {
			h.log.Error().Err(err).Msg("Failed to create user")
			c.JSON(http.StatusInternalServerError, models.Response{
				Message: "Failed to create user",
				Code:    http.StatusInternalServerError,
			})
		}
		return
	}

	token, err := utils.GenerateToken(req.Username, h.secretKey)
	if err != nil {
		h.log.Error().Err(err).Msg("Failed to generate token")
		c.JSON(http.StatusInternalServerError, models.Response{
			Message: "Failed to generate token",
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

	var hashed string
	err := h.userRepo.Login(req.Username, &hashed)
	if err != nil {
		c.JSON(http.StatusUnauthorized, models.Response{
			Message: "Invalid username or password",
			Code:    http.StatusUnauthorized,
		})
		return
	}

	if bcrypt.CompareHashAndPassword([]byte(hashed), []byte(req.Password)) != nil {
		c.JSON(http.StatusUnauthorized, models.Response{
			Message: "Invalid username or password",
			Code:    http.StatusUnauthorized,
		})
		return
	}

	token, err := utils.GenerateToken(req.Username, h.secretKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Message: "Failed to generate token",
			Code:    http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Message: "Login successful",
		Code:    http.StatusOK,
		Data:    token,
	})
}
