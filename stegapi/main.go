package main

import (
	"strings"

	"github.com/DimitarPetrov/stegify/steg"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

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

	r.Run(":5000")
}
