import 'package:flutter/material.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

class RecordsScreen extends StatefulWidget {
  const RecordsScreen({super.key});

  @override
  State<RecordsScreen> createState() => _RecordsScreenState();
}

class _RecordsScreenState extends State<RecordsScreen> {
  final ApiService _apiService = ApiService();
  List<MedicalRecord> _records = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final recs = await _apiService.fetchRecords();
    setState(() {
      _records = recs;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Medical Records'),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryEmerald))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _records.length,
              itemBuilder: (context, i) {
                final r = _records[i];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppTheme.softGreen,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                r.category,
                                style: const TextStyle(
                                  color: AppTheme.primaryEmerald,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            Text(r.date, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(r.title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textMain)),
                        const SizedBox(height: 4),
                        Text('${r.doctor} · ${r.facility}', style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
                        if (r.diagnosisNotes.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          Text(r.diagnosisNotes, style: const TextStyle(fontSize: 12, color: AppTheme.textMain)),
                        ],
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
