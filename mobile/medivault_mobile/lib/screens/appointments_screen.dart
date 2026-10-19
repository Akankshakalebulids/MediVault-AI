import 'package:flutter/material.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> {
  final ApiService _api = ApiService();
  late Future<List<Appointment>> _appointmentsFuture;

  @override
  void initState() {
    super.initState();
    _appointmentsFuture = _api.fetchAppointments();
  }

  void _refresh() {
    setState(() {
      _appointmentsFuture = _api.fetchAppointments();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Appointments'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refresh,
          ),
        ],
      ),
      body: FutureBuilder<List<Appointment>>(
        future: _appointmentsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: AppTheme.primaryEmerald));
          }

          final appts = snapshot.data ?? [];
          if (appts.isEmpty) {
            return const Center(
              child: Text(
                'No upcoming appointments scheduled',
                style: TextStyle(color: AppTheme.textSecondary),
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: appts.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final apt = appts[index];
              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppTheme.softGreen,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Icon(Icons.calendar_month, color: AppTheme.primaryEmerald, size: 20),
                              ),
                              const SizedBox(width: 10),
                              Text(
                                apt.doctorName,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 15,
                                  color: AppTheme.textMain,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.softGreen,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              apt.status,
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: AppTheme.primaryEmerald,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          const Icon(Icons.medical_services_outlined, size: 16, color: AppTheme.textSecondary),
                          const SizedBox(width: 6),
                          Text(
                            apt.specialty,
                            style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                          ),
                          const SizedBox(width: 16),
                          const Icon(Icons.place_outlined, size: 16, color: AppTheme.textSecondary),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              apt.clinicLocation,
                              style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(Icons.schedule, size: 16, color: AppTheme.primaryEmerald),
                          const SizedBox(width: 6),
                          Text(
                            apt.dateTime,
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.primaryEmerald,
                            ),
                          ),
                        ],
                      ),
                      if (apt.reason.isNotEmpty) ...[
                        const SizedBox(height: 10),
                        Text(
                          'Reason: ${apt.reason}',
                          style: const TextStyle(fontSize: 12.5, color: AppTheme.textMain),
                        ),
                      ],
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
