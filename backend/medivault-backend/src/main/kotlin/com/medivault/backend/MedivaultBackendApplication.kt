package com.medivault.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MedivaultBackendApplication

fun main(args: Array<String>) {
	runApplication<MedivaultBackendApplication>(*args)
}
