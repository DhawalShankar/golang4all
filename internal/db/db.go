// db.go
// Package db provides a shared NeonDB (Postgres) connection pool for the
// api/* serverless functions. Initialized once per warm instance since
// Vercel's Go runtime has no dedicated cold-start hook (PRD §2.1 / §6).
package db

import (
	"context"
	"fmt"
	"os"
	"sync"

	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	Pool *pgxpool.Pool
	once sync.Once
	initErr error
)

// Init lazily opens the pool on first call and is a no-op on later calls
// within the same warm instance. Call it at the top of every handler
// before touching Pool.
func Init(ctx context.Context) error {
	once.Do(func() {
		dsn := os.Getenv("NEON_DATABASE_URL")
		if dsn == "" {
			initErr = fmt.Errorf("NEON_DATABASE_URL is not set")
			return
		}
		cfg, err := pgxpool.ParseConfig(dsn)
		if err != nil {
			initErr = fmt.Errorf("parsing NEON_DATABASE_URL: %w", err)
			return
		}
		// Keep this low: Neon's own pooler (the "-pooler" host in the DSN)
		// absorbs concurrency, not this local pool.
		cfg.MaxConns = 5

		pool, err := pgxpool.NewWithConfig(ctx, cfg)
		if err != nil {
			initErr = fmt.Errorf("creating pool: %w", err)
			return
		}
		Pool = pool
	})
	return initErr
}
