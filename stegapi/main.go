package main

import (
	"strings"

	"github.com/DimitarPetrov/stegify/steg"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	r := gin.Default()

	r.Use(CORSMiddleware())
	r.MaxMultipartMemory = 8 << 20 // 8 MiB

	r.POST("/process_image", func(c *gin.Context) {
		key := c.PostForm("key")
		multipartFile, _ := c.FormFile("image")
		file, _ := multipartFile.Open()

		steg.Encode(file, strings.NewReader(key), c.Writer)
	})

	r.POST("/check_image", func(c *gin.Context) {
		multipartFile, _ := c.FormFile("image")
		file, _ := multipartFile.Open()

		steg.Decode(file, c.Writer)
	})

	r.Run(":8080")
}
