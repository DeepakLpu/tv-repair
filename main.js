 // Page Navigation System
 document.addEventListener('DOMContentLoaded', function() {
    // Get all page links
    const pageLinks = document.querySelectorAll('[data-page]');
    
    // Function to show a specific page
    function showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the selected page
        document.getElementById(pageId + '-page').classList.add('active');
        
        // Update active link in navigation
        pageLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
    
    // Add click event to all page links
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
            
            // Update URL without reloading
            history.pushState({page: pageId}, '', `#${pageId}`);
        });
    });
    
    // Check for hash on page load
    const initialPage = window.location.hash.substring(1) || 'home';
    showPage(initialPage);
    
    // Handle back/forward navigation
    window.addEventListener('popstate', function(e) {
        const pageId = e.state ? e.state.page : 'home';
        showPage(pageId);
    });
    
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Form Submissions
    const contactForm = document.getElementById('contactForm');
    const appointmentForm = document.getElementById('appointmentForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
    
    // Function to save appointment to localStorage
    function saveAppointment(appointmentData) {
        // Get existing appointments or initialize empty array
        let appointments = JSON.parse(localStorage.getItem('tvRepairAppointments')) || [];
        
        // Add new appointment with unique ID and timestamp
        const newAppointment = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...appointmentData
        };
        
        appointments.push(newAppointment);
        
        // Save back to localStorage
        localStorage.setItem('tvRepairAppointments', JSON.stringify(appointments));
        
        return newAppointment;
    }
    
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(appointmentForm);
        const appointmentData = {};
        formData.forEach((value, key) => {
            appointmentData[key] = value;
        });
        
        // Save to localStorage
        const savedAppointment = saveAppointment(appointmentData);
        
        // Here you would typically send the data to a server
        console.log('Appointment booked and saved:', savedAppointment);
        
        // Show confirmation with appointment ID
        alert(`Thank you, ${appointmentData.name}!\n\nYour appointment for ${appointmentData.service} on ${appointmentData.date} at ${appointmentData.time} has been booked.\n\nAppointment ID: ${savedAppointment.id}\n\nWe'll confirm shortly.`);
        
        // Reset form
        appointmentForm.reset();
    });
    
    // Show/hide address field based on service type
    const serviceType = document.getElementById('appointment-type');
    const addressLabel = document.querySelector('.address-label');
    const addressField = document.getElementById('appointment-address');
    
    serviceType.addEventListener('change', function() {
        if (this.value === 'on-site') {
            addressLabel.style.display = 'block';
            addressField.style.display = 'block';
            addressField.required = true;
        } else {
            addressLabel.style.display = 'none';
            addressField.style.display = 'none';
            addressField.required = false;
        }
    });
    
    // Initialize address field visibility
    addressLabel.style.display = 'none';
    addressField.style.display = 'none';
    addressField.required = false;
    
    // Set minimum date for appointment to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointment-date').min = today;
});