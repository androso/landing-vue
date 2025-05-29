<template>
  <div 
    v-if="showPopup" 
    class="exit-intent-overlay"
    @click.self="closePopup"
  >
    <div class="exit-intent-popup">
      <button class="close-btn" @click="closePopup">&times;</button>
      
      <div class="popup-content">
        <h2 ref="popupHeading">Wait! Are you sure you want to leave?</h2>
        <p ref="popupFirstParagraph">Don't miss out on the latest news about <strong>Mentarie</strong>!</p>
        <p>Leave your email address and stay updated with our latest features and updates.</p>
        
        <form @submit.prevent="submitEmail" class="email-form">
          <input 
            v-model="email" 
            type="email" 
            placeholder="Enter your email address"
            required
            class="email-input"
            ref="emailInput"
          />
          <button type="submit" class="submit-btn" :disabled="!isValidEmail">
            Stay Updated
          </button>
        </form>
        
        <div class="popup-actions">
          <button v-if="pendingReload" @click="proceedWithReload" class="reload-btn">
            {{ reloadType === 'f5' ? 'Refresh Page (F5)' : 'Reload Page (Ctrl+R)' }}
          </button>
          <button v-else @click="closePopup" class="leave-btn">
            No thanks, I'll leave
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExitIntentPopup',
  data() {
    return {
      showPopup: false,
      email: '',
      hasShown: false,
      timeOnPage: 0,
      scrollDirection: 0,
      lastScrollY: 0,
      isTabActive: true,
      pendingReload: false,
      reloadType: null // 'f5', 'ctrl-r', etc.
    }
  },
  computed: {
    isValidEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(this.email);
    }
  },
  mounted() {
    this.setupExitIntent();
    this.startTimeTracking();
  },
  beforeUnmount() {
    this.removeExitIntent();
  },
  methods: {
    setupExitIntent() {
      // Mouse leave detection (most reliable)
      document.addEventListener('mouseleave', this.handleMouseLeave);
      
      // Mouse movement detection for exit intent
      document.addEventListener('mousemove', this.handleMouseMove);
      
      // Scroll behavior detection
      window.addEventListener('scroll', this.handleScroll);
      
      // Tab visibility change (when user switches tabs)
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      
      // Focus/blur events (when user clicks outside browser)
      window.addEventListener('blur', this.handleWindowBlur);
      
      // Keyboard shortcuts detection
      document.addEventListener('keydown', this.handleKeyDown);
      
      // Browser close/refresh detection (for native dialog)
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    },
    
    removeExitIntent() {
      document.removeEventListener('mouseleave', this.handleMouseLeave);
      document.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('scroll', this.handleScroll);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      window.removeEventListener('blur', this.handleWindowBlur);
      document.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    },
    
    startTimeTracking() {
      // Track time on page (show popup after 30 seconds if other conditions are met)
      setInterval(() => {
        if (this.isTabActive) {
          this.timeOnPage += 1000;
        }
      }, 1000);
    },
    
    handleMouseLeave(event) {
      // Only trigger if mouse leaves from the top of the page (typical exit intent)
      if (event.clientY <= 0 && !this.hasShown && this.timeOnPage >= 10000) {
        this.showExitIntent();
      }
    },
    
    handleMouseMove(event) {
      // Detect rapid mouse movement towards top of screen
      if (event.clientY <= 50 && event.movementY < -20 && !this.hasShown && this.timeOnPage >= 5000) {
        this.showExitIntent();
      }
    },
    
    handleScroll() {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > this.lastScrollY ? 1 : -1;
      
      // If user scrolls up rapidly after being on page for a while
      if (scrollDirection === -1 && currentScrollY < 100 && this.timeOnPage >= 15000 && !this.hasShown) {
        this.showExitIntent();
      }
      
      this.lastScrollY = currentScrollY;
    },
    
    handleVisibilityChange() {
      if (document.hidden) {
        this.isTabActive = false;
        // User switched tabs - potential exit intent
        if (!this.hasShown && this.timeOnPage >= 10000) {
          // Small delay to show popup when they return
          setTimeout(() => {
            if (!document.hidden && !this.hasShown) {
              this.showExitIntent();
            }
          }, 1000);
        }
      } else {
        this.isTabActive = true;
      }
    },
    
    handleWindowBlur() {
      // User clicked outside browser window
      if (!this.hasShown && this.timeOnPage >= 8000) {
        setTimeout(() => {
          if (!this.hasShown) {
            this.showExitIntent();
          }
        }, 2000);
      }
    },
    
    handleKeyDown(event) {
      // Detect and prevent reload shortcuts
      const isReloadShortcut = (
        (event.ctrlKey && event.key === 'r') || // Ctrl+R
        event.key === 'F5' // F5
      );
      
      // Detect other exit shortcuts (don't prevent these)
      const isOtherExitShortcut = (
        (event.ctrlKey && event.key === 'w') || // Ctrl+W
        (event.altKey && event.key === 'F4') || // Alt+F4
        (event.ctrlKey && event.key === 'q') // Ctrl+Q
      );
      
      if (isReloadShortcut && !this.hasShown && this.timeOnPage >= 3000) {
        // Prevent the reload
        event.preventDefault();
        event.stopPropagation();
        
        // Set pending reload info
        this.pendingReload = true;
        this.reloadType = event.key === 'F5' ? 'f5' : 'ctrl-r';
        
        // Show popup with reload context
        this.showExitIntent('reload');
        
        return false;
      }
      
      if (isOtherExitShortcut && !this.hasShown && this.timeOnPage >= 3000) {
        // Show popup for other exit shortcuts (but don't prevent them)
        this.showExitIntent();
      }
    },
    
    handleBeforeUnload(event) {
      // Only set beforeunload message if popup hasn't been shown yet
      // This provides a native browser dialog as backup
      if (!this.hasShown && this.timeOnPage >= 5000) {
        event.preventDefault();
        event.returnValue = 'Are you sure you want to leave? You might miss important updates about Mentarie!';
        return event.returnValue;
      }
    },
    
    showExitIntent(context = null) {
      if (!this.hasShown) {
        this.showPopup = true;
        this.hasShown = true;
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Update message if this is a reload attempt
        if (context === 'reload') {
          this.updatePopupForReload();
        }
        
        // Focus the email input after a short delay
        this.$nextTick(() => {
          setTimeout(() => {
            if (this.$refs.emailInput) {
              this.$refs.emailInput.focus();
            }
          }, 300);
        });
      }
    },
    
    updatePopupForReload() {
      // Update the popup content to reflect reload attempt
      if (this.$refs.popupHeading && this.$refs.popupFirstParagraph) {
        this.$refs.popupHeading.textContent = 'Wait! Are you trying to reload the page?';
        this.$refs.popupFirstParagraph.innerHTML = 'Before you refresh, don\'t miss out on the latest news about <strong>Mentarie</strong>!';
      }
    },
    
    proceedWithReload() {
      // User chose to proceed with reload
      this.executePendingReload();
    },
    
    closePopup() {
      this.showPopup = false;
      document.body.style.overflow = ''; // Restore scrolling
      
      // If there was a pending reload, execute it now (unless user submitted email)
      if (this.pendingReload) {
        this.executePendingReload();
      }
    },
    
    executePendingReload() {
      if (this.pendingReload) {
        // Small delay to ensure popup closes smoothly
        setTimeout(() => {
          location.reload();
        }, 100);
      }
    },
    
    async submitEmail() {
      if (this.isValidEmail) {
        try {
          // Here you would typically send the email to your backend
          console.log('Email submitted:', this.email);
          
          // You can replace this with actual API call
          // await this.sendEmailToServer(this.email);
          
          // Show success message
          alert('Thank you! We\'ll keep you updated about Mentarie.');
          this.closePopup();
        } catch (error) {
          console.error('Error submitting email:', error);
          alert('Something went wrong. Please try again.');
        }
      }
    },
    
    // Uncomment and implement this method to send email to your backend
    // async sendEmailToServer(email) {
    //   const response = await fetch('/api/subscribe', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email })
    //   });
    //   
    //   if (!response.ok) {
    //     throw new Error('Failed to subscribe');
    //   }
    //   
    //   return response.json();
    // }
  }
}
</script>

<style scoped>
.exit-intent-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

.exit-intent-popup {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.popup-content {
  text-align: center;
  padding-right: 2rem;
}

.popup-content h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.popup-content p {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.email-form {
  margin: 2rem 0;
}

.email-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: border-color 0.2s ease;
}

.email-input:focus {
  outline: none;
  border-color: #007bff;
}

.submit-btn {
  width: 100%;
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.popup-actions {
  margin-top: 1.5rem;
}

.leave-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.leave-btn:hover {
  color: #333;
}

.reload-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.reload-btn:hover {
  color: #333;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-50px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .exit-intent-popup {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .popup-content {
    padding-right: 1rem;
  }
  
  .popup-content h2 {
    font-size: 1.3rem;
  }
}
</style> 