import 'package:flutter/material.dart';

class AppTheme {
  // Color Palette Constants
  static const Color primaryEmerald = Color(0xFF087F5B);
  static const Color secondaryGreen = Color(0xFF20A879);
  static const Color darkGreen = Color(0xFF075E45);
  static const Color white = Color(0xFFFFFFFF);
  static const Color paleMint = Color(0xFFF0FDF7);
  static const Color softGreen = Color(0xFFE6F7EF);
  static const Color textMain = Color(0xFF16352B);
  static const Color textSecondary = Color(0xFF64756D);
  static const Color borderLight = Color(0xFFDCECE3);
  static const Color statusWarning = Color(0xFFD97706);
  static const Color statusDanger = Color(0xFFD9383A);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: paleMint,
      primaryColor: primaryEmerald,
      colorScheme: const ColorScheme.light(
        primary: primaryEmerald,
        secondary: secondaryGreen,
        surface: white,
        background: paleMint,
        onPrimary: white,
        onSurface: textMain,
        error: statusDanger,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: white,
        foregroundColor: textMain,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: textMain,
          fontSize: 18,
          fontWeight: FontWeight.w700,
        ),
      ),
      cardTheme: CardTheme(
        color: white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: borderLight, width: 1),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryEmerald,
          foregroundColor: white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
        ),
      ),
    );
  }
}
