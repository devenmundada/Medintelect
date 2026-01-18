const pool = require('../config/database');

/**
 * GET /api/doctors
 * Fetch all doctors with optional filters
 */
exports.getAllDoctors = async (req, res) => {
  try {
    const {
      specialty,
      limit = 20,
      offset = 0
    } = req.query;

    let query = `
      SELECT 
        id,
        name,
        specialty,
        experience,
        rating,
        mode
      FROM doctors
    `;

    const values = [];
    const conditions = [];

    if (specialty) {
      values.push(specialty);
      conditions.push(`specialty = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += `
      ORDER BY rating DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    values.push(Number(limit), Number(offset));

    const result = await pool.query(query, values);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        count: result.rows.length
      }
    });
  } catch (error) {
    console.error('❌ Error fetching doctors:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching doctors'
    });
  }
};

/**
 * GET /api/doctors/:id
 * Fetch doctor by ID
 */
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM doctors WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error fetching doctor:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching doctor details'
    });
  }
};

/**
 * GET /api/doctors/specialties
 * Fetch distinct specialties
 */
exports.getSpecialties = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT specialty 
      FROM doctors
      ORDER BY specialty
    `);

    res.json({
      success: true,
      data: result.rows.map(r => r.specialty)
    });
  } catch (error) {
    console.error('❌ Error fetching specialties:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching specialties'
    });
  }
};

/**
 * GET /api/doctors/top-rated
 * Fetch top rated doctors
 */
exports.getTopRatedDoctors = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 10);

    const result = await pool.query(
      `
      SELECT *
      FROM doctors
      ORDER BY rating DESC
      LIMIT $1
      `,
      [limit]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Error fetching top rated doctors:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching top rated doctors'
    });
  }
};

/**
 * GET /api/doctors/specialty/:specialty
 * Fetch doctors by specialty
 */
exports.getDoctorsBySpecialty = async (req, res) => {
  try {
    const { specialty } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM doctors
      WHERE specialty = $1
      ORDER BY rating DESC
      `,
      [specialty]
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('❌ Error fetching doctors by specialty:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching doctors by specialty'
    });
  }
};
