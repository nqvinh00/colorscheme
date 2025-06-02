package models

// ColorScheme represents a terminal color scheme
type ColorScheme struct {
	ID       string            `json:"id"`
	Name     string            `json:"name"`
	Author   string            `json:"author"`
	Category string            `json:"category"`
	Colors   map[string]string `json:"colors"`
}
