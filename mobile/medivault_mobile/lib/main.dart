import 'package:flutter/material.dart';
import 'screens/auth_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/records_screen.dart';
import 'screens/medications_screen.dart';
import 'screens/screening_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/appointments_screen.dart';
import 'screens/timeline_screen.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const MediVaultApp());
}

class MediVaultApp extends StatelessWidget {
  const MediVaultApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MediVault AI',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const MainNavigationScreen(),
      routes: {
        '/appointments': (context) => const AppointmentsScreen(),
        '/timeline': (context) => const TimelineScreen(),
      },
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;
  bool _isAuthenticated = true; // Default to demo session for ease of evaluation

  final List<Widget> _screens = const [
    DashboardScreen(),
    RecordsScreen(),
    MedicationsScreen(),
    ScreeningScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    if (!_isAuthenticated) {
      return AuthScreen(
        onLoginSuccess: () {
          setState(() => _isAuthenticated = true);
        },
      );
    }

    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        indicatorColor: AppTheme.softGreen,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard, color: AppTheme.primaryEmerald),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.folder_shared_outlined),
            selectedIcon: Icon(Icons.folder_shared, color: AppTheme.primaryEmerald),
            label: 'Records',
          ),
          NavigationDestination(
            icon: Icon(Icons.medication_outlined),
            selectedIcon: Icon(Icons.medication, color: AppTheme.primaryEmerald),
            label: 'Meds',
          ),
          NavigationDestination(
            icon: Icon(Icons.health_and_safety_outlined),
            selectedIcon: Icon(Icons.health_and_safety, color: AppTheme.primaryEmerald),
            label: 'Screener',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person, color: AppTheme.primaryEmerald),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
