CREATE TABLE IF NOT EXISTS color_schemes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS color_scheme_colors (
    scheme_id TEXT NOT NULL,
    color_key TEXT NOT NULL,
    color_value TEXT NOT NULL,
    PRIMARY KEY (scheme_id, color_key),
    FOREIGN KEY (scheme_id) REFERENCES color_schemes(id) ON DELETE CASCADE
);
