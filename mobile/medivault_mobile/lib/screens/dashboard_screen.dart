import 'package:flutter/material.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';
import 'records_screen.dart';
import 'screening_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final ApiService _apiService = ApiService();
  List<MedicalRecord> _records = [];
  List<Medication> _meds = [];
  List<Appointment> _appts = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    final results = await Future.wait([
      _apiService.fetchRecords(),
      _apiService.fetchMedications(),
      _apiService.fetchAppointments(),
    ]);

    setState(() {
      _records = results[0] as List<MedicalRecord>;
      _meds = results[1] as List<Medication>;
      _appts = results[2] as List<Appointment>;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppTheme.primaryEmerald,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.favorite_rounded, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            const Text('MediVault AI'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryEmerald))
          : RefreshIndicator(
              onRefresh: _loadData,
              color: AppTheme.primaryEmerald,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Hero Card for Diabetes Risk Screener
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppTheme.darkGreen, AppTheme.primaryEmerald],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Text(
                            'AI RISK SCREENING',
                            style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          'Diabetes Risk Screening',
                          style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Screen metabolic indicators with our Random Forest pipeline.',
                          style: TextStyle(color: Color(0xFFDCECE3), fontSize: 13),
                        ),
                        const SizedBox(height: 14),
                        ElevatedButton.icon(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const ScreeningScreen()),
                            );
                          },
                          icon: const Icon(Icons.health_and_safety, color: AppTheme.darkGreen, size: 18),
                          label: const Text('Open Screener', style: TextStyle(color: AppTheme.darkGreen)),
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.white),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 18),

                  // Quick Stats Row
                  Row(
                    children: [
                      _buildStatCard('Records', '${_records.length}', Icons.description_outlined),
                      const SizedBox(width: 10),
                      _buildStatCard('Meds', '${_meds.length}', Icons.medication_outlined),
                      const SizedBox(width: 10),
                      _buildStatCard('Visits', '${_appts.length}', Icons.calendar_today_outlined),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Today's Medication Schedule
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: const [
                              Text('Daily Medication Schedule', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                              Text('Today', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                            ],
                          ),
                          const Divider(height: 20),
                          ..._meds.map((m) => Padding(
                                padding: const EdgeInsets.symmetric(vertical: 6),
                                child: Row(
                                  children: [
                                    const Icon(Icons.circle, size: 8, color: AppTheme.primaryEmerald),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(m.name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                                          Text('${m.dose} · ${m.frequency}', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
                                        ],
                                      ),
                                    ),
                                    Text(m.time, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.primaryEmerald)),
                                  ],
                                ),
                              )),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
          child: Column(
            children: [
              Icon(icon, color: AppTheme.primaryEmerald, size: 24),
              const SizedBox(height: 6),
              Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textMain)),
              Text(label, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
            ],
          ),
        ),
      ),
    );
  }
}
