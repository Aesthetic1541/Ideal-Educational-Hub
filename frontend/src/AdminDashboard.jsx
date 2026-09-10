import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  ClipboardCheck,
  Megaphone,
  LogOut,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  X,
} from "lucide-react";

import { api, clearSession } from "./api";

export default function AdminDashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    tests: 0,
    newEnquiries: 0,
  });

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    className: "",
    course: "",
    parentName: "",
    });
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [courseForm, setCourseForm] = useState({
    name: "",
    level: "",
    description: "",
    duration: "",
    mode: "Offline",
  });

  const [testForm, setTestForm] = useState({
    title: "",
    totalMarks: "",
    date: "",
  });

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [dashboard, studentData, courseData, testData, enquiryData] =
        await Promise.all([
          api.adminDashboard(),
          api.adminStudents(),
          api.adminCourses(),
          api.adminTests(),
          api.adminEnquiries(),
        ]);

      setStats(dashboard);
      setStudents(studentData);
      setCourses(courseData);
      setTests(testData);
      setEnquiries(enquiryData);
    } catch (err) {
      setError(err.message || "Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function logout() {
    clearSession();

    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/admin/login";
    }
  }

  function openCreateCourse() {
    setEditingCourse(null);
    setCourseForm({
      name: "",
      level: "",
      description: "",
      duration: "",
      mode: "Offline",
    });
    setShowCourseForm(true);
  }

  function openEditCourse(course) {
    setEditingCourse(course);

    setCourseForm({
      name: course.name || "",
      level: course.level || "",
      description: course.description || "",
      duration: course.duration || "",
      mode: course.mode || "Offline",
    });

    setShowCourseForm(true);
  }

  async function saveCourse(event) {
    event.preventDefault();

    try {
      setError("");

      if (editingCourse) {
        await api.adminUpdateCourse(editingCourse._id, courseForm);
      } else {
        await api.adminCreateCourse(courseForm);
      }

      setShowCourseForm(false);
      setEditingCourse(null);

      await loadDashboard();
    } catch (err) {
      setError(err.message || "Could not save course.");
    }
  }

  async function deleteCourse(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.adminDeleteCourse(id);
      await loadDashboard();
    } catch (err) {
      setError(err.message || "Could not delete course.");
    }
  }

  async function updateEnquiry(id, status) {
    try {
      setError("");

      await api.adminUpdateEnquiry(id, status);
      await loadDashboard();
    } catch (err) {
      setError(err.message || "Could not update enquiry.");
    }
  }

  async function createTest(event) {
    event.preventDefault();

    try {
      setError("");

      await api.adminCreateTest({
        title: testForm.title,
        totalMarks: Number(testForm.totalMarks),
        date: testForm.date,
        active: true,
      });

      setTestForm({
        title: "",
        totalMarks: "",
        date: "",
      });

      await loadDashboard();
    } catch (err) {
      setError(err.message || "Could not create test.");
    }
  }

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "students",
      label: "Students",
      icon: Users,
    },
    {
      id: "courses",
      label: "Courses",
      icon: BookOpen,
    },
    {
      id: "tests",
      label: "Tests",
      icon: FileText,
    },
    {
      id: "enquiries",
      label: "Enquiries",
      icon: MessageSquare,
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: ClipboardCheck,
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: Megaphone,
    },
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <div>
          <RefreshCw size={28} className="spin" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img
            src="/logo.png"
            alt="Ideal Educational Hub"
            className="admin-brand-logo"
            />

          <div>
            <strong>Ideal Educational Hub</strong>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={
                  activeSection === item.id ? "admin-nav-item active" : "admin-nav-item"
                }
                onClick={() => setActiveSection(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button className="admin-logout" onClick={logout}>
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">ADMINISTRATION</p>
            <h1>
              {menuItems.find((item) => item.id === activeSection)?.label ||
                "Dashboard"}
            </h1>
          </div>

          <button className="admin-refresh" onClick={loadDashboard}>
            <RefreshCw size={17} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="admin-error">
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* OVERVIEW */}
        {activeSection === "overview" && (
          <section>
            <div className="admin-stat-grid">
              <div className="admin-stat-card">
                <Users size={25} />
                <span>Total Students</span>
                <strong>{stats.students}</strong>
              </div>

              <div className="admin-stat-card">
                <BookOpen size={25} />
                <span>Active Courses</span>
                <strong>{stats.courses}</strong>
              </div>

              <div className="admin-stat-card">
                <FileText size={25} />
                <span>Active Tests</span>
                <strong>{stats.tests}</strong>
              </div>

              <div className="admin-stat-card">
                <MessageSquare size={25} />
                <span>New Enquiries</span>
                <strong>{stats.newEnquiries}</strong>
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Welcome, Administrator</h2>
                  <p>
                    Manage students, courses, tests, enquiries and institute
                    updates from one place.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STUDENTS */}
        {activeSection === "students" && (
        <section className="admin-panel">
            <div className="admin-panel-heading">
            <div>
                <h2>Students</h2>
                <p>Manage registered students and their course assignments.</p>
            </div>

            <button
            className="admin-btn primary"
            onClick={() => {
                setEditingStudent(null);
                setStudentForm({
                name: "",
                email: "",
                password: "",
                phone: "",
                className: "",
                course: "",
                parentName: "",
                });
                setStudentModalOpen(true);
            }}
            >
            + Add Student
            </button>
            </div>

            <div className="admin-table-wrap">
            <table className="admin-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Class</th>
                    <th>Course</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {students.length === 0 ? (
                    <tr>
                    <td colSpan="6" className="admin-empty">
                        No students found.
                    </td>
                    </tr>
                ) : (
                    students.map((student) => (
                    <tr key={student._id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.className || "—"}</td>

                        <td>
                        {student.course?.name || "Not assigned"}
                        </td>

                        <td>{student.phone || "—"}</td>

                        <td>
                        <div className="admin-actions">
                            <button
                            className="admin-icon-btn"
                            title="Edit student"
                            onClick={() => {
                                setStudentForm({
                                name: student.name || "",
                                email: student.email || "",
                                password: "",
                                phone: student.phone || "",
                                className: student.className || "",
                                course: student.course?._id || "",
                                parentName: student.parentName || "",
                                });

                                setEditingStudent(student);
                                setStudentModalOpen(true);
                            }}
                            >
                            Edit
                            </button>

                            <button
                                className="admin-icon-btn danger"
                                title="Delete student"
                                onClick={async () => {
                                    if (
                                    !window.confirm(
                                        `Delete ${student.name}? This cannot be undone.`
                                    )
                                    ) {
                                    return;
                                    }

                                    try {
                                    await api.adminDeleteStudent(student._id);

                                    const updated =
                                        await api.adminStudents();

                                    setStudents(updated);
                                    } catch (err) {
                                    alert(err.message);
                                    }
                                }}
                                >
                                ×
                                </button>
                        </div>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        </section>
        )}

        {/* COURSES */}
        {activeSection === "courses" && (
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Courses</h2>
                <p>Create and manage institute courses.</p>
              </div>

              <button className="admin-primary-btn" onClick={openCreateCourse}>
                <Plus size={17} />
                Add Course
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Level</th>
                    <th>Duration</th>
                    <th>Mode</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="admin-empty">
                        No courses found.
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => (
                      <tr key={course._id}>
                        <td>
                          <strong>{course.name}</strong>
                        </td>

                        <td>{course.level || "—"}</td>
                        <td>{course.duration || "—"}</td>
                        <td>{course.mode || "—"}</td>

                        <td>
                          <div className="admin-actions">
                            <button
                              className="admin-icon-btn"
                              onClick={() => openEditCourse(course)}
                              title="Edit course"
                            >
                              <Edit size={16} />
                            </button>

                            <button
                              className="admin-icon-btn danger"
                              onClick={() => deleteCourse(course._id)}
                              title="Delete course"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TESTS */}
        {activeSection === "tests" && (
          <section className="admin-two-column">
            <div className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Create Test</h2>
                  <p>Add a new test for students.</p>
                </div>
              </div>

              <form className="admin-form" onSubmit={createTest}>
                <label>
                  Test title
                  <input
                    value={testForm.title}
                    onChange={(e) =>
                      setTestForm({
                        ...testForm,
                        title: e.target.value,
                      })
                    }
                    placeholder="e.g. Mathematics Weekly Test"
                    required
                  />
                </label>

                <label>
                  Total marks
                  <input
                    type="number"
                    min="1"
                    value={testForm.totalMarks}
                    onChange={(e) =>
                      setTestForm({
                        ...testForm,
                        totalMarks: e.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  Test date
                  <input
                    type="date"
                    value={testForm.date}
                    onChange={(e) =>
                      setTestForm({
                        ...testForm,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                </label>

                <button className="admin-primary-btn" type="submit">
                  <Plus size={17} />
                  Create Test
                </button>
              </form>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Existing Tests</h2>
                  <p>{tests.length} tests in the system.</p>
                </div>
              </div>

              <div className="admin-list">
                {tests.length === 0 ? (
                  <p className="admin-empty">No tests found.</p>
                ) : (
                  tests.map((test) => (
                    <div className="admin-list-item" key={test._id}>
                      <div>
                        <strong>{test.title}</strong>
                        <span>
                          {test.totalMarks} marks
                          {test.date
                            ? ` • ${new Date(test.date).toLocaleDateString()}`
                            : ""}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* ENQUIRIES */}
        {activeSection === "enquiries" && (
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Enquiries</h2>
                <p>Manage enquiries submitted through the website.</p>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Course</th>
                    <th>Message</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="admin-empty">
                        No enquiries found.
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((enquiry) => (
                      <tr key={enquiry._id}>
                        <td>{enquiry.name}</td>
                        <td>{enquiry.phone || "—"}</td>
                        <td>{enquiry.course || "—"}</td>
                        <td>{enquiry.message || "—"}</td>

                        <td>
                          <select
                            value={enquiry.status || "new"}
                            onChange={(e) =>
                              updateEnquiry(
                                enquiry._id,
                                e.target.value
                              )
                            }
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ATTENDANCE */}
        {activeSection === "attendance" && (
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Attendance</h2>
                <p>Attendance management will be connected next.</p>
              </div>
            </div>

            <div className="admin-placeholder">
              <ClipboardCheck size={40} />
              <h3>Attendance Management</h3>
              <p>
                The backend API is ready. We'll build the attendance form
                next.
              </p>
            </div>
          </section>
        )}

        {/* ANNOUNCEMENTS */}
        {activeSection === "announcements" && (
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Announcements</h2>
                <p>Publish important notices for students.</p>
              </div>
            </div>

            <div className="admin-placeholder">
              <Megaphone size={40} />
              <h3>Announcements</h3>
              <p>
                We'll connect the announcement creation form next.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* COURSE MODAL */}
      {showCourseForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <h2>{editingCourse ? "Edit Course" : "Add Course"}</h2>
                <p>
                  {editingCourse
                    ? "Update course information."
                    : "Add a new course to the institute."}
                </p>
              </div>

              <button
                className="admin-modal-close"
                onClick={() => setShowCourseForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form className="admin-form" onSubmit={saveCourse}>
              <label>
                Course name
                <input
                  value={courseForm.name}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Course name"
                  required
                />
              </label>

              <label>
                Level
                <input
                  value={courseForm.level}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      level: e.target.value,
                    })
                  }
                  placeholder="e.g. Class 10-12"
                />
              </label>

              <label>
                Description
                <textarea
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Course description"
                  rows="4"
                />
              </label>

              <label>
                Duration
                <input
                  value={courseForm.duration}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      duration: e.target.value,
                    })
                  }
                  placeholder="e.g. 1 Year"
                />
              </label>

              <label>
                Mode
                <select
                  value={courseForm.mode}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      mode: e.target.value,
                    })
                  }
                >
                  <option value="Offline">Offline</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </label>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={() => setShowCourseForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="admin-primary-btn">
                  {editingCourse ? "Update Course" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT MODAL */}
        {studentModalOpen && (
        <div className="admin-modal-overlay">
            <div className="admin-modal">
            <div className="admin-modal-header">
                <div>
                <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>
                <p>
                    {editingStudent
                    ? "Update the student's information."
                    : "Create a new student account."}
                </p>
                </div>

                <button
                className="admin-modal-close"
                onClick={() => setStudentModalOpen(false)}
                >
                ×
                </button>
            </div>

            <form
                onSubmit={async (e) => {
                e.preventDefault();

                try {
                    if (editingStudent) {
                    await api.adminUpdateStudent(
                        editingStudent._id,
                        studentForm
                    );
                    alert("Student updated successfully.");
                    } else {
                    await api.adminCreateStudent(studentForm);
                    alert("Student created successfully.");
                    }

                    setStudentModalOpen(false);
                    setEditingStudent(null);

                    setStudentForm({
                    name: "",
                    email: "",
                    password: "",
                    phone: "",
                    className: "",
                    course: "",
                    parentName: "",
                    });

                    const updatedStudents = await api.adminStudents();
                    setStudents(updatedStudents.students || updatedStudents);
                } catch (error) {
                    alert(error.message || "Something went wrong.");
                }
                }}
            >
                <div className="admin-form-grid">

                <div className="admin-field">
                    <label>Student Name *</label>
                    <input
                    type="text"
                    value={studentForm.name}
                    onChange={(e) =>
                        setStudentForm({
                        ...studentForm,
                        name: e.target.value,
                        })
                    }
                    required
                    />
                </div>

                <div className="admin-field">
                    <label>Email *</label>
                    <input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) =>
                        setStudentForm({
                        ...studentForm,
                        email: e.target.value,
                        })
                    }
                    required
                    />
                </div>

                <div className="admin-field">
                    <label>
                    Password {editingStudent ? "(leave blank to keep current)" : "*"}
                    </label>
                    <input
                    type="password"
                    value={studentForm.password}
                    onChange={(e) =>
                        setStudentForm({
                        ...studentForm,
                        password: e.target.value,
                        })
                    }
                    required={!editingStudent}
                    />
                </div>

                <div className="admin-field">
                    <label>Phone</label>
                    <input
                    type="text"
                    value={studentForm.phone}
                    onChange={(e) =>
                        setStudentForm({
                        ...studentForm,
                        phone: e.target.value,
                        })
                    }
                    />
                </div>

                <div className="admin-field">
                    <label>Class</label>
                    <input
                    type="text"
                    value={studentForm.className}
                    onChange={(e) =>
                        setStudentForm({
                        ...studentForm,
                        className: e.target.value,
                        })
                    }
                    placeholder="e.g. Class 10"
                    />
                </div>

                <div className="admin-field">
                    <label>Course</label>
                    <select
                    value={studentForm.course}
                    onChange={(e) =>
                        setStudentForm({
                        ...studentForm,
                        course: e.target.value,
                        })
                    }
                    >
                    <option value="">Not assigned</option>

                    {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                        {course.name}
                        </option>
                    ))}
                    </select>
                </div>

                <div className="admin-field admin-field-full">
                    <label>Parent / Guardian Name</label>
                    <input
                    type="text"
                    value={studentForm.parentName}
                    onChange={(e) =>
                        setStudentForm({
                        ...studentForm,
                        parentName: e.target.value,
                        })
                    }
                    />
                </div>

                </div>

                <div className="admin-modal-actions">
                <button
                    type="button"
                    className="admin-btn secondary"
                    onClick={() => setStudentModalOpen(false)}
                >
                    Cancel
                </button>

                <button type="submit" className="admin-btn primary">
                    {editingStudent ? "Update Student" : "Create Student"}
                </button>
                </div>
            </form>
            </div>
        </div>
        )}
        </div>
    );
    }