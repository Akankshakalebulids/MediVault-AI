import 'package:flutter/material.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

class ScreeningScreen extends StatefulWidget {
  const ScreeningScreen({super.key});

  @override
  State<ScreeningScreen> createState() => _ScreeningScreenState();
}

class _ScreeningScreenState extends State<ScreeningScreen> {
  final ApiService _apiService = ApiService();

  final _glucoseController = TextEditingController(text: '120');
  final _bmiController = TextEditingController(text: '26.5');
  final _ageController = TextEditingController(text: '40');
  final _bpController = TextEditingController(text: '80');

  bool _loading = false;
  DiabetesPredictionResult? _result;

  Future<void> _runScreening() async {
    setState(() => _loading = true);
    final res = await _apiService.screenDiabetesRisk(
      glucose: double.tryParse(_glucoseController.text) ?? 100,
      bmi: double.tryParse(_bmiController.text) ?? 24,
      age: int.tryParse(_ageController.text) ?? 35,
      bloodPressure: double.tryParse(_bpController.text) ?? 75,
    );

    setState(() {
      _result = res;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Diabetes Risk Screening'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Non-diagnostic medical banner
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.softGreen,
              border: Border.all(color: AppTheme.borderLight),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Text(
              'Educational screening model only. Not a medical diagnosis. Consult a doctor for diagnostic blood tests.',
              style: TextStyle(color: AppTheme.darkGreen, fontSize: 12),
            ),
          ),
          const SizedBox(height: 16),

          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Patient Parameters', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _glucoseController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Fasting Glucose (mg/dL)'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _bmiController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Body Mass Index (BMI kg/m²)'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _ageController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Patient Age (years)'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _bpController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Blood Pressure (mm Hg)'),
                  ),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _loading ? null : _runScreening,
                      child: _loading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                            )
                          : const Text('Compute Risk Score'),
                    ),
                  ),
                ],
              ),
            ),
          ),

          if (_result != null) ...[
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    Text(
                      '${_result!.riskPercentage.toStringAsFixed(1)}%',
                      style: const TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primaryEmerald,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.softGreen,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Text(
                        _result!.riskLevel,
                        style: const TextStyle(
                          color: AppTheme.darkGreen,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Model: ${_result!.modelAlgorithm}',
                      style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
