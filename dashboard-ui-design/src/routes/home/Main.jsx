import './page.css'
function Main() {
    return (
      <div>
     
     <div class="section hero has-bg-image" id="home" aria-label="home"
          style={{backgroundImage: `url('/images/hero-bg.svg')`}}>
          <div class="container">
  
            <div class="hero-content">
  
              <h1 class="h1 section-title">
                The Best Program to <span class="span">Enroll</span> for Exchange
              </h1>
  
              <p class="hero-text">
                Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit.
              </p>
  
              <a href="#" class="btn has-before">
                <span class="span">Find courses</span>
  
                <ion-icon name="arrow-forward-outline" aria-hidden="true"></ion-icon>
              </a>
  
            </div>
  
            <figure class="hero-banner">
              
            </figure>
  
              
  
          </div>
        </div>
      
        <section class="section category" aria-label="category">
          <div class="container">
  
            <p class="section-subtitle">Categories</p>
  
            <h2 class="h2 section-title">
              Online <span class="span">Classes</span> For Remote Learning.
            </h2>
  
            <p class="section-text">
              Consectetur adipiscing elit sed do eiusmod tempor.
            </p>
  
            <ul class="grid-list">
  
              <li>
                <div class="category-card" >
  
                  <div class="card-icon">
                    <img src="/images/category-1.svg" width="40" height="40" loading="lazy"
                      alt="Online Degree Programs" class="img"/>
                  </div>
  

                  <h3 class="h3">
                    <a href="#" class="card-title">Online Degree Programs</a>
                  </h3>
  
                  <p class="card-text">
                    Lorem ipsum dolor consec tur elit adicing sed umod tempor.
                  </p>
  
                  <span class="card-badge">7 Courses</span>
  
                </div>
              </li>
  
              <li>
                <div class="category-card" >
  
                  <div class="card-icon">
                    <img src="/images/category-2.svg" width="40" height="40" loading="lazy"
                      alt="Non-Degree Programs" class="img"/>
                  </div>
  

                  <h3 class="h3">
                    <a href="#" class="card-title">Non-Degree Programs</a>
                  </h3>
  
                  <p class="card-text">
                    Lorem ipsum dolor consec tur elit adicing sed umod tempor.
                  </p>
  
                  <span class="card-badge">4 Courses</span>
  
                </div>
              </li>
  
              <li>
                <div class="category-card" >
  
                  <div class="card-icon">
                    <img src="/images/category-3.svg" width="40" height="40" loading="lazy"
                      alt="Off-Campus Programs" class="img"/>
                  </div>
  

                  <h3 class="h3">
                    <a href="#" class="card-title">Off-Campus Programs</a>
                  </h3>
  
                  <p class="card-text">
                    Lorem ipsum dolor consec tur elit adicing sed umod tempor.
                  </p>
  
                  <span class="card-badge">8 Courses</span>
  
                </div>
              </li>
  
              <li>
                <div class="category-card" >
  
                  <div class="card-icon">
                    <img src="/images/category-4.svg" width="40" height="40" loading="lazy"
                      alt="Hybrid Distance Programs" class="img"/>
                  </div>
  
                  <h3 class="h3">
                    <a href="#" class="card-title">Hybrid Distance Programs</a>
                  </h3>
  
                  <p class="card-text">
                    Lorem ipsum dolor consec tur elit adicing sed umod tempor.
                  </p>
  
                  <span class="card-badge">8 Courses</span>
  
                </div>
              </li>
  
            </ul>
  
          </div>
        </section>
  
        <section class="video has-bg-image" aria-label="video"
          style={{ backgroundImage: `url('/images/video-bg.png')` }}>
          <div class="container">
  

            <div class="video-card">
  
              <div class="video-banner img-holder has-after" >
                <img src="/images/video-banner.jpg" width="970" height="550" loading="lazy" alt="video banner"
                  class="img-cover"/>
  

                <button class="play-btn" aria-label="play video">
                  <ion-icon name="play" aria-hidden="true"></ion-icon>
                </button>
              </div>
  
              <img src="/images/video-shape-1.png" width="1089" height="605" loading="lazy" alt=""
                class="shape video-shape-1"/>
  

              <img src="/images/video-shape-2.png" width="158" height="174" loading="lazy" alt=""
                class="shape video-shape-2"/>
  

            </div>
  
          </div>
        </section>
  
  
  
  
  
       
  
        <section class="section stats" aria-label="stats">
          <div class="container">
  
            <ul class="grid-list">
  
              <li>
                <div class="stats-card" style={{"--color": "170, 75%, 41%"}}>
                  <h3 class="card-title">29.3k</h3>
  
                  <p class="card-text">Student Enrolled</p>
                </div>
              </li>
  
              <li>
                <div class="stats-card" style={{"--color": "351, 83%, 61%"}}>
                  <h3 class="card-title">32.4K</h3>
  
                  <p class="card-text">Class Completed</p>
                </div>
              </li>
  
              <li>
                <div class="stats-card" style={{"--color": "260, 100%, 67%"}}>
                  <h3 class="card-title">100%</h3>
  
                  <p class="card-text">Satisfaction Rate</p>
                </div>
              </li>
  
              <li>
                <div class="stats-card" style={{"--color": "42, 94%, 55%"}}>
                  <h3 class="card-title">354+</h3>
  
                  <p class="card-text">Top Instructors</p>
                </div>
              </li>
  
            </ul>
  
          </div>
        </section>
  
    </div>
          ) 
          }
  export default Main;