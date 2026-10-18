class MedicalRecord {
  final String id;
  final String title;
  final String category;
  final String doctor;
  final String facility;
  final String date;
  final String diagnosisNotes;
  final String status;

  MedicalRecord({
    required this.id,
    required this.title,
    required this.category,
    required this.doctor,
    required this.facility,
    required this.date,
    required this.diagnosisNotes,
    required this.status,
  });

  factory MedicalRecord.fromJson(Map<String, dynamic> json) {
    return MedicalRecord(
      id: json['id']?.toString() ?? '',
      title: json['title'] ?? '',
      category: json['category'] ?? 'Laboratory',
      doctor: json['doctor'] ?? '',
      facility: json['facility'] ?? '',
      date: json['date'] ?? '',
      diagnosisNotes: json['diagnosisNotes'] ?? '',
      status: json['status'] ?? 'Reviewed',
    );
  }
}

class Medication {
  final String id;
  final String name;
  final String dose;
  final String frequency;
  final String time;
  final String status;
  final String instructions;

  Medication({
    required this.id,
    required this.name,
    required this.dose,
    required this.frequency,
    required this.time,
    required this.status,
    required this.instructions,
  });

  factory Medication.fromJson(Map<String, dynamic> json) {
    return Medication(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      dose: json['dose'] ?? '',
      frequency: json['frequency'] ?? 'Once daily',
      time: json['time'] ?? '08:00 AM',
      status: json['status'] ?? 'Active',
      instructions: json['instructions'] ?? '',
    );
  }
}

class Appointment {
  final String id;
  final String doctorName;
  final String specialty;
  final String clinicLocation;
  final String dateTime;
  final String reason;
  final String status;

  Appointment({
    required this.id,
    required this.doctorName,
    required this.specialty,
    required this.clinicLocation,
    required this.dateTime,
    required this.reason,
    required this.status,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['id']?.toString() ?? '',
      doctorName: json['doctorName'] ?? '',
      specialty: json['specialty'] ?? '',
      clinicLocation: json['clinicLocation'] ?? '',
      dateTime: json['dateTime'] ?? '',
      reason: json['reason'] ?? '',
      status: json['status'] ?? 'Confirmed',
    );
  }
}

class DiabetesPredictionResult {
  final double riskScore;
  final double riskPercentage;
  final String riskLevel;
  final String modelAlgorithm;
  final String disclaimer;

  DiabetesPredictionResult({
    required this.riskScore,
    required this.riskPercentage,
    required this.riskLevel,
    required this.modelAlgorithm,
    required this.disclaimer,
  });

  factory DiabetesPredictionResult.fromJson(Map<String, dynamic> json) {
    return DiabetesPredictionResult(
      riskScore: (json['riskScore'] as num).toDouble(),
      riskPercentage: (json['riskPercentage'] as num).toDouble(),
      riskLevel: json['riskLevel'] ?? 'Low Risk',
      modelAlgorithm: json['modelAlgorithm'] ?? 'Random Forest',
      disclaimer: json['disclaimer'] ?? '',
    );
  }
}
