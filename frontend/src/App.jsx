import React,{useEffect,useState} from "react";
import {Routes,Route,Link,useNavigate,useParams} from "react-router-dom";
import {motion} from "framer-motion";
import {ArrowRight,BookOpen,Brain,CheckCircle,ChevronDown,Clock3,GraduationCap,MapPin,Menu,Phone,ShieldCheck,Star,Target,Trophy,Users,X,BarChart3,CalendarDays,FileText,LogIn,MessageCircle} from "lucide-react";
import {LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid} from "recharts";
import {api,clearSession,getSessionUser,saveSession} from "./api";

const fallbackCourses=[
 {name:"Foundation Program",tag:"Classes 8–10",description:"Build strong concepts, study habits and confidence for the next academic stage.",icon:Brain},
 {name:"Board Excellence",tag:"Classes 10–12",description:"Focused academic support, revision and regular assessments for board preparation.",icon:BookOpen},
 {name:"Competitive Preparation",tag:"JEE / NEET",description:"Concept-first preparation with structured practice, tests and mentorship.",icon:Target}
];
const faculty=[
 {name:"Faculty Member",subject:"Mathematics",exp:"Experienced Faculty",initial:"M"},
 {name:"Faculty Member",subject:"Science",exp:"Experienced Faculty",initial:"S"},
 {name:"Faculty Member",subject:"English",exp:"Experienced Faculty",initial:"E"},
 {name:"Faculty Member",subject:"Mentorship",exp:"Student Guidance",initial:"G"}
];
const performance=[{test:"T1",score:62},{test:"T2",score:68},{test:"T3",score:71},{test:"T4",score:79},{test:"T5",score:84}];

function Layout({children}){
 const [open,setOpen]=useState(false);
 const nav=[["Home","/"],["Courses","/courses"],["Faculty","/faculty"],["Results","/results"],["About","/about"],["Contact","/contact"]];
 return <><header className="nav"><div className="container navin"><Link to="/" className="brand"><span className="brandmark">IE</span><span><b>Ideal Educational Hub</b><small>Motivational Training Centre</small></span></Link><button className="menubtn" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><nav className={open?"links open":"links"}>{nav.map(([t,u])=><Link key={u} to={u} onClick={()=>setOpen(false)}>{t}</Link>)}<Link className="login" to="/student/login">Student Login</Link><Link className="btn small" to="/admissions">Book a Demo</Link></nav></div></header>{children}<Footer/></>
}
function Footer(){return <footer><div className="container footgrid"><div><div className="brand footerbrand"><span className="brandmark">IE</span><span><b>Ideal Educational Hub</b><small>Motivational Training Centre</small></span></div><p>Focused learning, disciplined preparation and personal guidance for students.</p></div><div><h4>Explore</h4><Link to="/courses">Courses</Link><Link to="/faculty">Faculty</Link><Link to="/results">Results</Link><Link to="/about">About Us</Link></div><div><h4>Student</h4><Link to="/student/login">Student Login</Link><Link to="/admissions">Admissions</Link><Link to="/contact">Contact</Link></div><div><h4>Visit Us</h4><p><MapPin size={15}/> Kisan Chowk, Kaptanganj (Captainganj), Kushinagar – 274301, Uttar Pradesh</p></div></div><div className="copyright">© 2026 Ideal Educational Hub & Motivational Training Centre. All rights reserved.</div></footer>}

function Home(){
 return <Layout><main>
 <section className="hero"><div className="container heroGrid"><motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.5}}><div className="eyebrow">LEARN • PRACTICE • PROGRESS</div><h1>Build strong concepts.<br/><em>Build your future.</em></h1><p className="lead">A student-focused coaching and tuition centre in Kaptanganj, helping learners develop clarity, consistency and confidence.</p><div className="actions"><Link className="btn" to="/courses">Explore Courses <ArrowRight size={17}/></Link><Link className="btn ghost" to="/admissions">Book a Free Demo</Link></div><div className="trust"><span><CheckCircle/> Concept-focused</span><span><CheckCircle/> Regular practice</span><span><CheckCircle/> Personal guidance</span></div></motion.div><div className="heroCard"><div className="orb"></div><div className="heroPanel"><div className="panelTop"><span>STUDENT PROGRESS</span><BarChart3 size={19}/></div><div className="bigScore">84<small>%</small></div><p>Sample performance dashboard</p><div className="bars"><i style={{height:"45%"}}/><i style={{height:"60%"}}/><i style={{height:"52%"}}/><i style={{height:"78%"}}/><i style={{height:"88%"}}/></div></div><div className="floating"><Trophy size={18}/><b>Keep improving</b><span>Consistency compounds.</span></div></div></div></section>
 <section className="stats"><div className="container statgrid">{[["10+","Focus on learning"],["Weekly","Practice & assessment"],["1:1","Guidance where needed"],["Local","Student-first support"]].map(x=><div key={x[0]}><strong>{x[0]}</strong><span>{x[1]}</span></div>)}</div></section>
 <section className="section"><div className="container"><SectionHead eyebrow="WHAT WE OFFER" title="Learning designed around students" text="Clear concepts, structured practice and guidance that keeps students moving forward."/><CourseDataSection /></div></section>
 <section className="section soft"><div className="container two"><div><div className="eyebrow">WHY IDEAL EDUCATIONAL HUB</div><h2>More than tuition.<br/>A learning system.</h2><p>Students need more than lectures. They need a place to ask questions, practise consistently, understand mistakes and build confidence.</p><Link className="textlink" to="/about">Discover our approach <ArrowRight size={16}/></Link></div><div className="featurelist">{["Concept clarity before memorisation","Regular tests and feedback","Personal attention and doubt support","A disciplined, positive learning environment"].map((x,i)=><div className="feature" key={x}><span>{String(i+1).padStart(2,"0")}</span><div><b>{x}</b><p>Structured support that helps students make steady progress.</p></div></div>)}</div></div></section>
 <section className="section"><div className="container"><SectionHead eyebrow="THE NEXT STEP" title="Ready to start learning?" text="Talk to the centre, ask your questions and find the right program for your student."/><div className="cta"><div><h3>Book a free counselling / demo session</h3><p>Share your class and learning goals. We'll help you understand the available options.</p></div><Link className="btn light" to="/admissions">Get Started <ArrowRight size={17}/></Link></div></div></section>
 </main></Layout>
}
function SectionHead({eyebrow,title,text}){return <div className="sectionhead"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2></div><p>{text}</p></div>}
function CourseCard({c,i}){
  const I = c.icon || [Brain,BookOpen,Target][i%3];

  return (
    <motion.div
      className="card course"
      initial={{opacity:0,y:15}}
      whileInView={{opacity:1,y:0}}
      viewport={{once:true}}
      transition={{delay:i*.08}}
    >
      <div className="course-top">
        <div className="iconbox">
          <I/>
        </div>
        <span className="tag">{c.tag}</span>
      </div>

      <h3>{c.name}</h3>

      <p>
        {c.description || c.desc}
      </p>

      <div className="course-meta">
        <span>
          <Clock3 size={15}/>
          {c.duration || "Academic year"}
        </span>

        <span>
          <GraduationCap size={15}/>
          {c.mode || "Offline / Centre"}
        </span>
      </div>

      <Link
        to={`/courses/${c._id || encodeURIComponent(c.name)}`}
        className="textlink"
      >
        View course
        <ArrowRight size={15}/>
      </Link>
    </motion.div>
  );
}

function CourseDataSection(){
  const [items,setItems] = useState(fallbackCourses);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");

  useEffect(()=>{
    api.getCourses()
      .then(data=>{
        const courses = data.map((c,i)=>({
          ...c,
          icon:[Brain,BookOpen,Target][i%3]
        }));

        setItems(courses);
      })
      .catch(e=>{
        setError(e.message);
        setItems(fallbackCourses);
      })
      .finally(()=>{
        setLoading(false);
      });
  },[]);

  return (
    <>
      {loading && (
        <p className="api-note">
          Loading live courses…
        </p>
      )}

      {error && (
        <p className="api-note">
          Showing demo course information.
        </p>
      )}

      <div className="cards3">
        {items.map((c,i)=>(
          <CourseCard
            key={c._id || c.name}
            c={c}
            i={i}
          />
        ))}
      </div>
    </>
  );
}

function Courses(){return <Layout><PageHero eyebrow="PROGRAMS" title="Courses built for steady progress" text="Explore our learning programs. Final batch schedules, fees and subject combinations can be confirmed directly with the centre."/><section className="section"><div className="container"><CourseDataSection /></div></section><section className="section soft"><div className="container"><h2>What students can expect</h2><div className="pills">{["Concept teaching","Practice sheets","Regular assessments","Doubt support","Progress feedback","Mentorship"].map(x=><span key={x}><CheckCircle size={16}/>{x}</span>)}</div></div></section></Layout>}
function CourseDetails(){
  const {id} = useParams();

  const [course,setCourse] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");

  useEffect(()=>{
    api.getCourses()
      .then(data=>{
        const found = data.find(
          c =>
            c._id === id ||
            c.name === decodeURIComponent(id)
        );

        if(!found){
          throw new Error("Course not found.");
        }

        setCourse(found);
      })
      .catch(err=>{
        setError(err.message);
      })
      .finally(()=>{
        setLoading(false);
      });
  },[id]);

  if(loading){
    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="card loadingcard">
              Loading course...
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if(error || !course){
    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="card">
              <div className="eyebrow">
                PROGRAM
              </div>

              <h2>Course not found</h2>

              <p>
                {error || "This course could not be found."}
              </p>

              <Link
                className="btn"
                to="/courses"
              >
                <ArrowRight
                  size={17}
                  style={{transform:"rotate(180deg)"}}
                />
                Back to Courses
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const I = [Brain,BookOpen,Target][
    course.name === "Board Excellence"
      ? 1
      : course.name === "Competitive Preparation"
      ? 2
      : 0
  ];

  return (
    <Layout>

      <PageHero
        eyebrow="PROGRAM"
        title={course.name}
        text={
          course.description ||
          course.desc
        }
      />

      <section className="section">
        <div className="container">

          <div className="course-detail-grid">

            {/* LEFT */}
            <div className="card course-overview">

              <div className="detail-icon">
                <I/>
              </div>

              <span className="tag">
                {course.tag}
              </span>

              <h2>
                {course.name}
              </h2>

              <p className="detail-description">
                {course.description ||
                  course.desc}
              </p>

              <div className="detail-list">

                <div>
                  <Clock3/>
                  <section>
                    <b>Duration</b>
                    <span>
                      {course.duration ||
                        "As per batch"}
                    </span>
                  </section>
                </div>

                <div>
                  <GraduationCap/>
                  <section>
                    <b>Learning mode</b>
                    <span>
                      {course.mode ||
                        "Offline / Centre"}
                    </span>
                  </section>
                </div>

                <div>
                  <BookOpen/>
                  <section>
                    <b>Target group</b>
                    <span>
                      {course.tag ||
                        "Students"}
                    </span>
                  </section>
                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div className="card">

              <div className="eyebrow">
                CURRICULUM
              </div>

              <h2>
                What you'll study
              </h2>

              <p>
                Build understanding through
                concepts, structured practice
                and regular assessment.
              </p>

              <div className="subject-list">

                {(course.subjects || []).map(
                  subject => (
                    <div
                      className="subject-item"
                      key={subject}
                    >
                      <CheckCircle size={18}/>
                      <span>{subject}</span>
                    </div>
                  )
                )}

              </div>

              <div className="detail-cta">

                <div>
                  <b>Interested in this program?</b>
                  <span>
                    Talk to the centre about
                    batches and availability.
                  </span>
                </div>

                <Link
                  className="btn"
                  to="/admissions"
                >
                  Enquire Now
                  <ArrowRight size={17}/>
                </Link>

              </div>

            </div>

          </div>

          <div className="back-link">
            <Link
              to="/courses"
              className="textlink"
            >
              <ArrowRight
                size={15}
                style={{
                  transform:"rotate(180deg)"
                }}
              />
              Back to all courses
            </Link>
          </div>

        </div>
      </section>

    </Layout>
  );
}

function PageHero({eyebrow,title,text}){return <section className="pagehero"><div className="container"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div></section>}
function Faculty(){return <Layout><PageHero eyebrow="FACULTY" title="Guidance that students can trust" text="Meet the educators and mentors behind the learning experience. Replace these sample profiles with the centre's verified faculty details."/><section className="section"><div className="container cards4">{faculty.map(f=><div className="faculty card" key={f.subject}><div className="avatar">{f.initial}</div><span className="tag">{f.subject}</span><h3>{f.name}</h3><p>{f.exp}</p></div>)}</div></section></Layout>}
function Results(){return <Layout><PageHero eyebrow="RESULTS & PROGRESS" title="Celebrate real progress" text="This section is ready for verified student results, achievements and year-wise performance once the institute's data is provided."/><section className="section"><div className="container"><div className="notice"><ShieldCheck/><div><b>Data integrity matters.</b><p>No ranks, percentages or selection claims are shown here until verified institute data is added.</p></div></div><div className="resultgrid"><div className="resultcard"><Trophy/><strong>Student achievements</strong><span>Add verified achievements here.</span></div><div className="resultcard"><BarChart3/><strong>Year-wise results</strong><span>Add verified annual performance data.</span></div><div className="resultcard"><Star/><strong>Student stories</strong><span>Add genuine testimonials and stories.</span></div></div></div></section></Layout>}
function About(){return <Layout><PageHero eyebrow="ABOUT US" title="A place to learn with purpose" text="Ideal Educational Hub & Motivational Training Centre is focused on creating a supportive, disciplined and student-first learning environment in Kaptanganj."/><section className="section"><div className="container two"><div><div className="eyebrow">OUR APPROACH</div><h2>Understand first. Practise consistently. Improve continuously.</h2></div><div><p>Our approach is built around academic fundamentals and regular practice. The goal is not simply to complete a syllabus, but to help students become more confident and independent learners.</p><p>As a local coaching centre, we aim to keep communication straightforward for students and parents.</p></div></div></section><section className="section soft"><div className="container"><SectionHead eyebrow="CORE VALUES" title="What we care about" text="A simple framework for a strong learning environment."/><div className="cards3">{["Clarity","Consistency","Confidence"].map((x,i)=><div className="card value" key={x}><span>0{i+1}</span><h3>{x}</h3><p>Help students understand what they are learning, practise it regularly and approach challenges with confidence.</p></div>)}</div></div></section></Layout>}
function Contact() {
  return (
    <Layout>
      <PageHero
        eyebrow="CONTACT"
        title="Let's talk about your learning goals"
        text="Visit us at Kisan Chowk, Kaptanganj (Captainganj), Kushinagar – 274301, Uttar Pradesh."
      />

      <section className="section">
        <div className="container contactgrid">

          <div className="contactbox">
            <h2>Visit the centre</h2>

            <div className="contactitem">
              <MapPin />
              <div>
                <b>Address</b>
                <p>
                  Kisan Chowk, Kaptanganj (Captainganj), Kushinagar – 274301,
                  Uttar Pradesh, India
                </p>
              </div>
            </div>

            <div className="contactitem">
              <Phone />
              <div>
                <b>Phone</b>
                <p>+91-9792320915</p>
              </div>
            </div>

            <div className="contactitem">
              <MessageCircle />
              <div>
                <b>WhatsApp</b>
                <p>+91-9792320915</p>
              </div>
            </div>

            {/* Google Maps */}
            <div className="mapbox">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1892.8972792557026!2d83.69941237744403!3d26.919311114966597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3993fbd8bcccf20f%3A0xe6a10bbc1545f300!2sIdeal%20Educational%20Hub!5e0!3m2!1sen!2sin!4v1789048492508!5m2!1sen!2sin"
                title="Ideal Educational Hub location"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
          </div>

          <Enquiry />

        </div>
      </section>
    </Layout>
  );
}
function Admissions(){return <Layout><PageHero eyebrow="ADMISSIONS" title="Start with a conversation" text="Submit an enquiry and the centre can follow up with the right course, batch and schedule information."/><section className="section"><div className="container narrow"><Enquiry/></div></section></Layout>}
function Enquiry(){
 const [sent,setSent]=useState(false); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
 const submit=async e=>{e.preventDefault();setLoading(true);setError("");const form=new FormData(e.currentTarget);const payload=Object.fromEntries(form.entries());
   try{await api.submitEnquiry(payload);setSent(true);e.currentTarget.reset();}catch(err){setError(err.message);}
   finally{setLoading(false);}
 };
 return <form className="form card" onSubmit={submit}><div className="eyebrow">ENQUIRY FORM</div><h2>{sent?"Thanks! Enquiry submitted.":"Tell us a little about the student"}</h2>{sent?<><p>Your enquiry has been saved to the institute backend. The centre can now view it from the admin system.</p><button className="btn ghost" type="button" onClick={()=>setSent(false)}>Submit another enquiry</button></>:<><div className="formgrid"><label>Student name<input name="studentName" required placeholder="Enter name"/></label><label>Parent/Guardian name<input name="parentName" placeholder="Enter name"/></label><label>Phone number<input name="phone" required placeholder="Enter phone"/></label><label>Email<input name="email" type="email" placeholder="Enter email"/></label><label>Class<select name="className"><option value="">Choose class</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option></select></label><label>Program<select name="program"><option value="">Choose program</option>{fallbackCourses.map(c=><option key={c.name}>{c.name}</option>)}</select></label></div><label>Message<textarea name="message" placeholder="Tell us about the student's goals or questions"></textarea></label>{error&&<p className="formerror">{error}</p>}<button className="btn" type="submit" disabled={loading}>{loading?"Submitting…":"Submit Enquiry"} {!loading&&<ArrowRight size={17}/>}</button></>}</form>}
function StudentLogin(){
 const nav=useNavigate(); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
 useEffect(()=>{if(getSessionUser()) nav("/student/dashboard",{replace:true});},[nav]);
 const submit=async e=>{e.preventDefault();setLoading(true);setError("");const form=new FormData(e.currentTarget);try{const data=await api.login(form.get("email"),form.get("password"));if(data.user.role!=="student"){throw new Error("This login is not a student account.");}saveSession(data);nav("/student/dashboard");}catch(err){setError(err.message);}finally{setLoading(false);}};
 return <Layout><section className="loginpage"><div className="loginbox card"><div className="brand center"><span className="brandmark">IE</span></div><div className="eyebrow">STUDENT PORTAL</div><h1>Welcome back</h1><p>Sign in with your student account to view live results, attendance, tests and announcements.</p><form onSubmit={submit}><label>Email / Student ID<input name="email" required type="email" placeholder="student@idealhub.local"/></label><label>Password<input name="password" required type="password" placeholder="••••••••"/></label>{error&&<p className="formerror">{error}</p>}<button className="btn full" disabled={loading}>{loading?"Logging in…":"Log In"} {!loading&&<LogIn size={17}/>}</button></form><p className="demo-hint">Demo student: <b>student@idealhub.local</b> · <b>Student123!</b></p></div></section></Layout>
}
function Dashboard(){
 const nav=useNavigate(); const [data,setData]=useState(null); const [error,setError]=useState("");
 useEffect(()=>{if(!localStorage.getItem("idealhub_token")){nav("/student/login",{replace:true});return;}api.getDashboard().then(setData).catch(err=>{clearSession();setError(err.message);nav("/student/login",{replace:true});});},[nav]);
 if(!data) return <Layout><section className="dash"><div className="container"><div className="card loadingcard">Loading your dashboard…</div></div></section></Layout>;
 const performance=(data.recentResults||[]).slice().reverse().map((r,i)=>({test:r.test?.title?.slice(0,8)||`T${i+1}`,score:r.percentage}));
 const upcoming=(data.upcomingTests||[]).slice(0,4);
 const user=data.user||getSessionUser()||{};
 return <Layout><section className="dash"><div className="container"><div className="dashhead"><div><div className="eyebrow">STUDENT DASHBOARD</div><h1>Welcome, {user.name || "Student"} 👋</h1><p>{user.className?`Class ${user.className}`:"Your live learning overview"}{user.course?.name?` · ${user.course.name}`:""}</p></div><button className="btn ghost" onClick={()=>{clearSession();nav("/student/login")}}>Log out</button></div><div className="metricgrid">{[[`${data.stats?.overallScore||0}%`,"Overall score"],[`${data.stats?.attendance||0}%`,"Attendance"],[`${data.stats?.testsCompleted||0}`,"Tests completed"]].map(x=><div className="metric card" key={x[1]}><span>{x[1]}</span><strong>{x[0]}</strong></div>)}</div><div className="dashgrid"><div className="chart card"><div className="cardhead"><div><b>Performance trend</b><span>Recent tests</span></div><BarChart3/></div><div className="chartbox">{performance.length?<ResponsiveContainer width="100%" height="100%"><LineChart data={performance}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="test"/><YAxis domain={[0,100]}/><Tooltip/><Line type="monotone" dataKey="score" strokeWidth={3}/></LineChart></ResponsiveContainer>:<div className="empty">No results have been added yet.</div>}</div></div><div className="card upcoming"><div className="cardhead"><div><b>Upcoming tests</b><span>From the institute</span></div><CalendarDays/></div>{upcoming.length?upcoming.map(x=><div className="listrow" key={x._id}><Clock3/><span>{x.title} · {x.subject}</span><small>{x.scheduledAt?new Date(x.scheduledAt).toLocaleDateString():"TBA"}</small></div>):<div className="empty">No upcoming tests.</div>}</div></div>{(data.announcements||[]).length>0&&<div className="card announcements"><div className="cardhead"><div><b>Announcements</b><span>Latest institute notices</span></div><FileText/></div>{data.announcements.map(a=><div className="announcement" key={a._id}><b>{a.title}</b><p>{a.message}</p></div>)}</div>}</div></section></Layout>
}
function FAQ(){const [a,setA]=useState(null);let qs=["What courses do you offer?","How can I book a demo?","Do you provide study material?","How frequently are tests conducted?"];return <Layout><PageHero eyebrow="FAQ" title="Frequently asked questions" text="Quick answers for students and parents."/><section className="section"><div className="container faq">{qs.map((q,i)=><div className="faqitem" key={q}><button onClick={()=>setA(a===i?null:i)}><span>{q}</span>{a===i?<X/>:<ChevronDown/>}</button>{a===i&&<p>Course-specific details, timings and availability can be confirmed directly with the institute. This demo site is intentionally not inventing information that has not been provided.</p>}</div>)}</div></section></Layout>}


export default function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/courses" element={<Courses/>}/><Route path="/courses/:id" element={<CourseDetails/>}/><Route path="/faculty" element={<Faculty/>}/><Route path="/results" element={<Results/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="/admissions" element={<Admissions/>}/><Route path="/faq" element={<FAQ/>}/><Route path="/student/login" element={<StudentLogin/>}/><Route path="/student/dashboard" element={<Dashboard/>}/><Route path="*" element={<Home/>}/></Routes>}
