import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class AuthScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;

  const AuthScreen({super.key, required this.onLoginSuccess});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isSignUp = false;

  void _submit() {
    // In mobile demo / evaluated mode, provide immediate authentication
    widget.onLoginSuccess();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.softGreen,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.shield_outlined,
                    size: 48,
                    color: AppTheme.primaryEmerald,
                  ),
                ),
                const SizedBox(height: 18),
                const Text(
                  'MediVault AI',
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textMain,
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Secure Patient-Controlled Health Vault',
                  style: TextStyle(
                    fontSize: 13,
                    color: AppTheme.textSecondary,
                  ),
                ),
                const SizedBox(height: 32),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        TextField(
                          controller: _emailController,
                          decoration: const InputDecoration(
                            labelText: 'Email Address',
                            prefixIcon: Icon(Icons.email_outlined, color: AppTheme.primaryEmerald),
                            border: OutlineInputBorder(),
                          ),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _passwordController,
                          obscureText: true,
                          decoration: const InputDecoration(
                            labelText: 'Password',
                            prefixIcon: Icon(Icons.lock_outline, color: AppTheme.primaryEmerald),
                            border: OutlineInputBorder(),
                          ),
                        ),
                        const SizedBox(height: 24),
                        SizedBox(
                          width: double.infinity,
                          height: 46,
                          child: ElevatedButton(
                            onPressed: _submit,
                            child: Text(_isSignUp ? 'Create Account' : 'Sign In'),
                          ),
                        ),
                        const SizedBox(height: 12),
                        TextButton(
                          onPressed: () => setState(() => _isSignUp = !_isSignUp),
                          child: Text(
                            _isSignUp
                                ? 'Already have an account? Sign In'
                                : 'Need an account? Register',
                            style: const TextStyle(color: AppTheme.primaryEmerald),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                OutlinedButton.icon(
                  onPressed: widget.onLoginSuccess,
                  icon: const Icon(Icons.play_arrow_outlined, color: AppTheme.primaryEmerald),
                  label: const Text('Continue in Offline Demo Mode', style: TextStyle(color: AppTheme.primaryEmerald)),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppTheme.primaryEmerald),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
