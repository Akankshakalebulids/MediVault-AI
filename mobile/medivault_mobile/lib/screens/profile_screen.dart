import 'package:flutter/material.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final ApiService _api = ApiService();
  late Future<UserProfile> _profileFuture;

  @override
  void initState() {
    super.initState();
    _profileFuture = _api.fetchProfile();
  }

  void _refresh() {
    setState(() {
      _profileFuture = _api.fetchProfile();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Patient Profile & Health ID'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refresh,
          ),
        ],
      ),
      body: FutureBuilder<UserProfile>(
        future: _profileFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: AppTheme.primaryEmerald));
          }

          final profile = snapshot.data ??
              UserProfile(
                displayName: 'Alex Carter',
                email: 'alex.carter@medivault.local',
                bloodGroup: 'O+',
                emergencyContact: '+1 555-0199',
                phone: '+1 555-0100',
              );

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 36,
                        backgroundColor: AppTheme.softGreen,
                        child: Text(
                          profile.displayName.isNotEmpty ? profile.displayName[0] : 'U',
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primaryEmerald,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        profile.displayName,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textMain,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        profile.email,
                        style: const TextStyle(
                          fontSize: 13,
                          color: AppTheme.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppTheme.softGreen,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          'Blood Group: ${profile.bloodGroup}',
                          style: const TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.primaryEmerald,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Contact & Emergency Information',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 14.5,
                          color: AppTheme.textMain,
                        ),
                      ),
                      const Divider(height: 24, color: AppTheme.borderLight),
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: const Icon(Icons.phone_outlined, color: AppTheme.primaryEmerald),
                        title: const Text('Phone Number', style: TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
                        subtitle: Text(profile.phone, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                      ),
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: const Icon(Icons.emergency_outlined, color: AppTheme.statusDanger),
                        title: const Text('Emergency Contact', style: TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
                        subtitle: Text(profile.emergencyContact, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                      ),
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: const Icon(Icons.verified_user_outlined, color: AppTheme.primaryEmerald),
                        title: const Text('Security & Access Scope', style: TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
                        subtitle: const Text('Local AES encryption active', style: TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
