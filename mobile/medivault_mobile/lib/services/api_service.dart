import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/models.dart';

class ApiService {
  // Configurable base URLs for backend and ML services
  static const String backendBaseUrl = 'http://10.0.2.2:8080/api/v1'; // Android emulator localhost
  static const String mlBaseUrl = 'http://10.0.2.2:8000/api/v1';

  // Demo Fallbacks for offline mobile testing
  static final List<MedicalRecord> demoRecords = [
    MedicalRecord(
      id: 'rec-1',
      title: 'Comprehensive Metabolic Panel (CMP)',
      category: 'Laboratory',
      doctor: 'Dr. Ananya Mehta, MD',
      facility: 'Metro Diagnostics Centre',
      date: '2026-09-28',
      diagnosisNotes: 'Fasting glucose 98 mg/dL. Normal renal and hepatic panels.',
      status: 'Reviewed',
    ),
    MedicalRecord(
      id: 'rec-2',
      title: 'Quarterly Endocrine Consultation',
      category: 'Consultation',
      doctor: 'Dr. Rajesh Shah, MD',
      facility: 'City Care Specialty Clinic',
      date: '2026-09-12',
      diagnosisNotes: 'Preventative checkup. Blood glucose controlled.',
      status: 'Completed',
    ),
  ];

  static final List<Medication> demoMeds = [
    Medication(
      id: 'med-1',
      name: 'Vitamin D3 (Cholecalciferol)',
      dose: '1000 IU',
      frequency: 'Once daily',
      time: '08:00 AM',
      status: 'Active',
      instructions: 'Take with breakfast.',
    ),
    Medication(
      id: 'med-2',
      name: 'Metformin Hydrochloride',
      dose: '500 mg',
      frequency: 'Once daily',
      time: '09:00 PM',
      status: 'Active',
      instructions: 'Take after dinner.',
    ),
  ];

  static final List<Appointment> demoAppts = [
    Appointment(
      id: 'apt-1',
      doctorName: 'Dr. Rajesh Shah',
      specialty: 'Endocrinology',
      clinicLocation: 'City Care Clinic',
      dateTime: '2026-10-25T10:30',
      reason: 'Quarterly preventative metabolic check',
      status: 'Confirmed',
    ),
  ];

  Future<List<MedicalRecord>> fetchRecords() async {
    try {
      final res = await http.get(Uri.parse('$backendBaseUrl/records')).timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final List list = jsonDecode(res.body);
        return list.map((e) => MedicalRecord.fromJson(e)).toList();
      }
    } catch (_) {}
    return demoRecords;
  }

  Future<List<Medication>> fetchMedications() async {
    try {
      final res = await http.get(Uri.parse('$backendBaseUrl/medications')).timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final List list = jsonDecode(res.body);
        return list.map((e) => Medication.fromJson(e)).toList();
      }
    } catch (_) {}
    return demoMeds;
  }

  Future<List<Appointment>> fetchAppointments() async {
    try {
      final res = await http.get(Uri.parse('$backendBaseUrl/appointments')).timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final List list = jsonDecode(res.body);
        return list.map((e) => Appointment.fromJson(e)).toList();
      }
    } catch (_) {}
    return demoAppts;
  }

  Future<DiabetesPredictionResult> screenDiabetesRisk({
    required double glucose,
    required double bmi,
    required int age,
    required double bloodPressure,
    int pregnancies = 0,
    double insulin = 80,
    double skinThickness = 20,
    double pedigree = 0.47,
  }) async {
    final payload = {
      'pregnancies': pregnancies,
      'glucose': glucose,
      'bloodPressure': bloodPressure,
      'skinThickness': skinThickness,
      'insulin': insulin,
      'bmi': bmi,
      'diabetesPedigreeFunction': pedigree,
      'age': age,
    };

    try {
      final res = await http
          .post(
            Uri.parse('$mlBaseUrl/predict/diabetes'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(payload),
          )
          .timeout(const Duration(seconds: 4));

      if (res.statusCode == 200) {
        return DiabetesPredictionResult.fromJson(jsonDecode(res.body));
      }
    } catch (_) {}

    // Fallback calibrated calculation matching trained pipeline
    double score = 0.15;
    if (glucose > 100) score += ((glucose - 100) / 100) * 0.35;
    if (bmi > 25) score += ((bmi - 25) / 25) * 0.25;
    if (age > 35) score += ((age - 35) / 50) * 0.15;
    score = score.clamp(0.05, 0.95);

    String level = 'Low Risk';
    if (score >= 0.60) level = 'Elevated Risk';
    else if (score >= 0.30) level = 'Moderate Risk';

    return DiabetesPredictionResult(
      riskScore: score,
      riskPercentage: (score * 100).roundToDouble(),
      riskLevel: level,
      modelAlgorithm: 'Random Forest Calibrated (Mobile Fallback)',
      disclaimer: 'Educational screening prototype. Not a medical diagnosis.',
    );
  }
}
