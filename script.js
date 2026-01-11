/**
 * Roommate Sync - Frontend Logic
 * Handles Authentication, Quiz State, and Score Animation
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. AUTH PAGE LOGIC ---
    if (document.querySelector('.page-auth')) {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabIndicator = document.querySelector('.tab-indicator');
        
        tabBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                // Toggle Active Class
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Move Indicator
                if (index === 0) {
                    tabIndicator.style.transform = 'translateX(0)';
                } else {
                    tabIndicator.style.transform = 'translateX(100%)';
                }
                
                // Optional: Toggle Form fields logic could go here
                const btnText = btn.dataset.tab === 'login' ? 'Continue to Dashboard' : 'Create Account';
                document.querySelector('.btn-primary span').textContent = btnText;
            });
        });
    }

    // --- 2. QUIZ PAGE LOGIC ---
    if (document.querySelector('.page-quiz')) {
        let currentStep = 1;
        const totalSteps = 4;
        
        // Progress Bar & Text Elements
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        const currentStepText = document.getElementById('currentStep');
        const checkItems = document.querySelectorAll('.check-item');

        window.nextStep = function(step) {
            if(step > totalSteps) return;
            
            // Hide current card
            document.querySelector('.question-card.active').classList.remove('active');
            
            // Show next card
            const nextCard = document.getElementById(`q${step}`);
            nextCard.classList.add('active');
            
            // Update State
            currentStep = step;
            updateProgress();
        };

        window.prevStep = function(step) {
            if(step < 1) return;
            
            document.querySelector('.question-card.active').classList.remove('active');
            document.getElementById(`q${step}`).classList.add('active');
            
            currentStep = step;
            updateProgress();
        };

        function updateProgress() {
            // Update percentage
            const percent = (currentStep / totalSteps) * 100;
            progressBar.style.width = `${percent}%`;
            progressPercent.textContent = `${percent}%`;
            currentStepText.textContent = currentStep;

            // Update Sidebar Checklist
            checkItems.forEach((item, index) => {
                if (index < currentStep) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }

    // --- 3. RESULTS PAGE LOGIC ---
    if (document.querySelector('.page-result')) {
        const scoreCircle = document.getElementById('scoreCircle');
        const scoreNumber = document.getElementById('scoreNumber');
        const targetScore = 94; // The calculated compatibility score
        
        // Circular Progress Logic
        const radius = scoreCircle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        scoreCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        scoreCircle.style.strokeDashoffset = circumference;
        
        function setProgress(percent) {
            const offset = circumference - (percent / 100) * circumference;
            scoreCircle.style.strokeDashoffset = offset;
        }

        // Animate Score on Load
        setTimeout(() => {
            setProgress(targetScore);
            
            // Counter Animation
            let start = 0;
            const duration = 2000;
            const stepTime = Math.abs(Math.floor(duration / targetScore));
            
            const timer = setInterval(() => {
                start += 1;
                scoreNumber.textContent = start;
                if (start == targetScore) {
                    clearInterval(timer);
                }
            }, stepTime);
            
        }, 500); // Small delay for visual impact
    }
    
    // --- 4. GLOBAL MOUSE PARALLAX (Subtle) ---
    const orbs = document.querySelectorAll('.orb');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
            const yOffset = (window.innerHeight / 2 - e.clientY) / speed;
            
            // Apply slight transform based on mouse position
            // Note: Keeping existing animation via CSS, adding slight offset via JS
            // orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
});
