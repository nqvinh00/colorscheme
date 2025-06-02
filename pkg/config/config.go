package config

import (
	"os"

	"github.com/nqvinh00/colorscheme/constant"
	"gopkg.in/yaml.v2"
)

type Config struct {
	Environment constant.Environment `json:"environment" yaml:"environment"`
	Port        string               `json:"port" yaml:"port"`
	DB          DBConfig             `json:"db" yaml:"db"`
	JwtSecret   string               `json:"jwt_secret" yaml:"jwt_secret"`
}

type DBConfig struct {
	Host            string `json:"host" yaml:"host"`
	Port            int    `json:"port" yaml:"port"`
	User            string `json:"user" yaml:"user"`
	Password        string `json:"password" yaml:"password"`
	DBName          string `json:"db_name" yaml:"db_name"`
	SSLMode         string `json:"ssl_mode" yaml:"ssl_mode"`
	MaxOpenConns    int    `json:"max_open_conns" yaml:"max_open_conns"`
	MaxIdleConns    int    `json:"max_idle_conns" yaml:"max_idle_conns"`
	ConnMaxLifetime int    `json:"conn_max_lifetime" yaml:"conn_max_lifetime"`
}

func LoadConfig(path string) (*Config, error) {
	var config Config

	yamlFile, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	err = yaml.Unmarshal(yamlFile, &config)
	if err != nil {
		return nil, err
	}

	return &config, nil
}
