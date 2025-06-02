package main

import (
	"flag"
	"fmt"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"

	"github.com/nqvinh00/colorscheme/handlers"
	"github.com/nqvinh00/colorscheme/handlers/middleware"
	"github.com/nqvinh00/colorscheme/pkg/database"
	"github.com/nqvinh00/colorscheme/repository"

	"github.com/nqvinh00/colorscheme/constant"
	"github.com/nqvinh00/colorscheme/pkg/config"
	"github.com/nqvinh00/colorscheme/pkg/log"
)

var (
	configPath = flag.String("config", "./config.yaml", "path to config file")
)

func main() {
	flag.Parse()

	log := log.InitLog()

	cfg, err := config.LoadConfig(*configPath)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to load config")
	}

	if cfg.Environment != constant.Production {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	db, err := database.InitDBConnection(cfg.DB)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to connect to database")
	}
	userRepo := repository.NewUserRepository(db)
	colorSchemeRepo := repository.NewColorSchemeRepository(db)
	userHandler := handlers.NewUserHandler(userRepo, cfg.JwtSecret, log)
	colorSchemeHandler := handlers.NewColorSchemeHandler(colorSchemeRepo, log)

	router := gin.New()
	router.Use(gin.Recovery())

	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("./client/dist", true)))

	// Setup route group for the API
	api := router.Group("/api")
	{
		api.POST("/register", userHandler.CreateAccount)
		api.POST("/login", userHandler.Login)

		secureApi := api.Group("/", middleware.AuthMiddleware(cfg.JwtSecret))
		{
			secureApi.GET("/color-schemes", colorSchemeHandler.GetAllColorSchemesByAuthor)
			secureApi.GET("/color-schemes/:id", colorSchemeHandler.GetColorSchemeById)
			secureApi.POST("/color-schemes", colorSchemeHandler.CreateColorScheme)
		}
	}

	log.Info().Msg("Starting server...")
	router.Run(fmt.Sprintf(":%s", cfg.Port))
}
