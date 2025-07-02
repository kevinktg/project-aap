"use client";

import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ChevronRight, ChevronLeft, Volume2, Users, Calendar, Music, DollarSign, CheckCircle } from 'lucide-react';
import { useGSAP, useFLIPAnimations } from '../hooks/useAdvancedGSAP';
import AnimatedFormField from './AnimatedFormField';
import AdvancedAnimatedCard from './AdvancedAnimatedCard';
import MorphingButton from './MorphingButton';
import FLIPStepTransition from './FLIPStepTransition';
import TextSelectionUnderline from './TextSelectionUnderline';

interface FormData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  pax: number;
  duration: number;
  musicGenre: string;
  equipment: string[];
  date: string;
}

const PriceCalculator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev' | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    pax: 0,
    duration: 4,
    musicGenre: '',
    equipment: [],
    date: ''
  });

  const [competitorPrice, setCompetitorPrice] = useState(0);
  const [ourPrice, setOurPrice] = useState(0);

  const {
    containerRef,
    animateLayoutChange
  } = useFLIPAnimations();

  const eventTypes = [
    { name: 'Wedding', basePrice: 800, icon: '💒' },
    { name: 'Birthday Party', basePrice: 400, icon: '🎂' },
    { name: 'Corporate Event', basePrice: 600, icon: '🏢' },
    { name: 'School Dance', basePrice: 350, icon: '🎓' },
    { name: 'Community Event', basePrice: 300, icon: '🏘️' },
    { name: 'Other', basePrice: 450, icon: '🎉' }
  ];

  const musicGenres = [
    'Top 40 Hits', 'Hip Hop', 'Rock', 'Electronic/EDM', 
    'Country', 'Jazz', 'Classical', 'Mixed/Everything'
  ];

  const equipmentOptions = [
    { name: 'Basic Sound System', price: 0 },
    { name: 'Wireless Microphones', price: 50 },
    { name: 'LED Lighting', price: 100 },
    { name: 'Fog Machine', price: 75 },
    { name: 'Extra Speakers', price: 80 },
    { name: 'DJ Booth Setup', price: 60 }
  ];

  const calculatePrice = () => {
    const eventType = eventTypes.find(e => e.name === formData.eventType);
    const basePrice = eventType?.basePrice || 450;
    
    const paxMultiplier = formData.pax > 100 ? 1.3 : formData.pax > 50 ? 1.15 : 1;
    const durationPrice = (formData.duration - 4) * 80;
    const equipmentPrice = formData.equipment.reduce((total, eq) => {
      const equipment = equipmentOptions.find(e => e.name === eq);
      return total + (equipment?.price || 0);
    }, 0);

    const total = Math.round((basePrice * paxMultiplier) + durationPrice + equipmentPrice);
    const competitor = Math.round(total * 1.8);
    
    setOurPrice(total);
    setCompetitorPrice(competitor);
  };

  const nextStep = () => {
    if (currentStep === steps.length - 2) {
      calculatePrice();
    }
    
    setTransitionDirection('next');
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setTransitionDirection('prev');
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleEquipment = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  // Advanced GSAP animations with useGSAP hook
  useGSAP(
    ({ selector }) => {
      // Animate progress bar
      const progress = ((currentStep + 1) / steps.length) * 100;
      const progressBar = selector('.progress-bar')[0];
      
      if (progressBar) {
        gsap.to(progressBar, {
          width: `${progress}%`,
          duration: 1,
          ease: 'power3.out'
        });
      }

      // Animate floating testimonial
      const testimonial = selector('.floating-testimonial')[0];
      if (testimonial && currentStep > 0 && currentStep < steps.length - 1) {
        gsap.fromTo(testimonial,
          {
            opacity: 0,
            x: 100,
            scale: 0.8
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
            delay: 0.5
          }
        );
      }
    },
    [currentStep],
    containerRef
  );

  const steps = [
    // Step 0: Welcome
    {
      title: "Welcome to Affordable Audio",
      subtitle: "Perth's most budget-friendly event audio specialists",
      content: (
        <div className="text-center space-y-6">
          <AnimatedFormField delay={0.2}>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Professional Audio Setup" 
                className="w-48 h-48 mx-auto rounded-full border-4 border-yellow-400 shadow-2xl object-cover"
              />
              <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold transform rotate-12 animate-pulse">
                50% OFF!
              </div>
            </div>
          </AnimatedFormField>
          
          <AnimatedFormField delay={0.4}>
            <TextSelectionUnderline>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                🎯 Quality Sound Without Breaking the Bank
              </h2>
              <p className="text-lg text-gray-700">
                Tired of overpriced audio companies? We're here to change that!
              </p>
            </TextSelectionUnderline>
          </AnimatedFormField>
          
          <AnimatedFormField delay={0.6}>
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-yellow-500 p-6 rounded-lg shadow-lg">
              <TextSelectionUnderline>
                <p className="text-yellow-800 font-semibold text-lg">
                  💡 Our mission: Professional audio at prices that make sense
                </p>
              </TextSelectionUnderline>
            </div>
          </AnimatedFormField>
        </div>
      )
    },
    // Step 1: Contact Info
    {
      title: "Let's Get Started!",
      subtitle: "First, tell us who you are",
      content: (
        <div className="space-y-6">
          <AnimatedFormField delay={0.1}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none text-lg transition-all duration-300 shadow-sm"
                placeholder="What should we call you?"
              />
            </div>
          </AnimatedFormField>
          
          <AnimatedFormField delay={0.2}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none text-lg transition-all duration-300 shadow-sm"
                placeholder="your@email.com"
              />
            </div>
          </AnimatedFormField>
          
          <AnimatedFormField delay={0.3}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none text-lg transition-all duration-300 shadow-sm"
                placeholder="04XX XXX XXX"
              />
            </div>
          </AnimatedFormField>
        </div>
      )
    },
    // Step 2: Event Type
    {
      title: "What's the Occasion?",
      subtitle: "Every event deserves great sound",
      content: (
        <div className="grid grid-cols-2 gap-4">
          {eventTypes.map((event, index) => (
            <AdvancedAnimatedCard
              key={event.name}
              onClick={() => updateFormData('eventType', event.name)}
              selected={formData.eventType === event.name}
              className="p-6 text-center hover:shadow-xl transition-all duration-300"
              delay={index * 0.1}
              animationType="flip"
              layoutId={`event-${event.name}`}
            >
              <div className="text-4xl mb-3">{event.icon}</div>
              <TextSelectionUnderline>
                <div className="font-semibold text-gray-800 text-lg">{event.name}</div>
                <div className="text-sm text-gray-600 mt-2">From ${event.basePrice}</div>
              </TextSelectionUnderline>
            </AdvancedAnimatedCard>
          ))}
        </div>
      )
    },
    // Step 3: Guest Count
    {
      title: "How Many People?",
      subtitle: "We need to know the crowd size",
      content: (
        <div className="space-y-8">
          <AnimatedFormField delay={0.1}>
            <div className="text-center">
              <Users className="w-20 h-20 mx-auto text-yellow-500 mb-6" />
              <div className="text-7xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                {formData.pax}
              </div>
              <TextSelectionUnderline>
                <div className="text-gray-600 text-xl">Expected Guests</div>
              </TextSelectionUnderline>
            </div>
          </AnimatedFormField>
          
          <AnimatedFormField delay={0.3}>
            <div>
              <input
                type="range"
                min="10"
                max="500"
                value={formData.pax}
                onChange={(e) => updateFormData('pax', parseInt(e.target.value))}
                className="w-full h-4 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-lg appearance-none cursor-pointer slider shadow-lg"
              />
            </div>
          </AnimatedFormField>
          
          <AnimatedFormField delay={0.4}>
            <div className="flex justify-between text-sm text-gray-500">
              <span className="font-medium">10 people</span>
              <span className="font-medium">500+ people</span>
            </div>
          </AnimatedFormField>
        </div>
      )
    },
    // Step 4: Duration
    {
      title: "How Long is Your Event?",
      subtitle: "Duration affects equipment and setup",
      content: (
        <div className="space-y-8">
          <AnimatedFormField delay={0.1}>
            <div className="text-center">
              <Calendar className="w-20 h-20 mx-auto text-yellow-500 mb-6" />
              <div className="text-7xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                {formData.duration}
              </div>
              <TextSelectionUnderline>
                <div className="text-gray-600 text-xl">Hours</div>
              </TextSelectionUnderline>
            </div>
          </AnimatedFormField>
          
          <AnimatedFormField delay={0.3}>
            <div>
              <input
                type="range"
                min="2"
                max="12"
                value={formData.duration}
                onChange={(e) => updateFormData('duration', parseInt(e.target.value))}
                className="w-full h-4 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-lg appearance-none cursor-pointer slider shadow-lg"
              />
            </div>
          </AnimatedFormField>
          
          <AnimatedFormField delay={0.4}>
            <div className="flex justify-between text-sm text-gray-500">
              <span className="font-medium">2 hours</span>
              <span className="font-medium">12+ hours</span>
            </div>
          </AnimatedFormField>
          
          <AnimatedFormField delay={0.6}>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 shadow-lg">
              <TextSelectionUnderline>
                <p className="text-blue-800 text-sm font-medium">
                  💡 <strong>Pro tip:</strong> Our base package includes 4 hours. Additional hours are just $80 each!
                </p>
              </TextSelectionUnderline>
            </div>
          </AnimatedFormField>
        </div>
      )
    },
    // Step 5: Music Genre
    {
      title: "What's Your Vibe?",
      subtitle: "Music genre helps us prepare the right playlist",
      content: (
        <div className="space-y-6">
          <AnimatedFormField delay={0.1}>
            <div className="text-center">
              <Music className="w-20 h-20 mx-auto text-yellow-500 mb-6" />
            </div>
          </AnimatedFormField>
          
          <div className="grid grid-cols-2 gap-4">
            {musicGenres.map((genre, index) => (
              <AdvancedAnimatedCard
                key={genre}
                onClick={() => updateFormData('musicGenre', genre)}
                selected={formData.musicGenre === genre}
                className="p-4 text-center hover:shadow-xl transition-all duration-300"
                delay={index * 0.05}
                animationType="magnetic"
                layoutId={`genre-${genre}`}
              >
                <TextSelectionUnderline>
                  <div className="font-medium text-gray-800">{genre}</div>
                </TextSelectionUnderline>
              </AdvancedAnimatedCard>
            ))}
          </div>
        </div>
      )
    },
    // Step 6: Equipment
    {
      title: "Any Extras?",
      subtitle: "Optional add-ons to make your event special",
      content: (
        <div className="space-y-6">
          <AnimatedFormField delay={0.1}>
            <div className="text-center">
              <Volume2 className="w-20 h-20 mx-auto text-yellow-500 mb-6" />
            </div>
          </AnimatedFormField>
          
          <div className="space-y-4">
            {equipmentOptions.map((equipment, index) => (
              <AnimatedFormField key={equipment.name} delay={index * 0.1}>
                <label className="flex items-center justify-between p-5 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-yellow-300 transition-all duration-300 shadow-sm hover:shadow-lg">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.equipment.includes(equipment.name)}
                      onChange={() => toggleEquipment(equipment.name)}
                      className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500 transition-all duration-200"
                    />
                    <TextSelectionUnderline>
                      <span className="ml-4 font-medium text-gray-800 text-lg">{equipment.name}</span>
                    </TextSelectionUnderline>
                  </div>
                  <span className="text-yellow-600 font-bold text-lg">
                    {equipment.price === 0 ? 'Included' : `+$${equipment.price}`}
                  </span>
                </label>
              </AnimatedFormField>
            ))}
          </div>
        </div>
      )
    },
    // Step 7: Date
    {
      title: "When's the Big Day?",
      subtitle: "We're booking up fast!",
      content: (
        <div className="space-y-8">
          <AnimatedFormField delay={0.1}>
            <div className="text-center">
              <Calendar className="w-20 h-20 mx-auto text-yellow-500 mb-6" />
            </div>
          </AnimatedFormField>
          
          <AnimatedFormField delay={0.3}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Event Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => updateFormData('date', e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none text-lg transition-all duration-300 shadow-sm"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </AnimatedFormField>
          
          <AnimatedFormField delay={0.5}>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6 shadow-lg">
              <TextSelectionUnderline>
                <p className="text-red-800 text-sm font-medium">
                  ⚡ <strong>Limited Time:</strong> Book within 48 hours and save an extra 10%!
                </p>
              </TextSelectionUnderline>
            </div>
          </AnimatedFormField>
        </div>
      )
    },
    // Step 8: Price Reveal
    {
      title: "Here's What Others Charge...",
      subtitle: "vs. What We Charge",
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <TextSelectionUnderline>
              <h3 className="text-3xl font-bold text-gray-800 mb-8">Price Comparison</h3>
            </TextSelectionUnderline>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Competitor Price */}
              <div className="competitor-price bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-8 shadow-xl">
                <TextSelectionUnderline>
                  <h4 className="text-xl font-bold text-red-800 mb-4">Typical Perth Audio Company</h4>
                  <div className="text-5xl font-bold text-red-600 mb-4">${competitorPrice}</div>
                  <div className="text-sm text-red-700 space-y-1">
                    <div>❌ Hidden fees</div>
                    <div>❌ Equipment rental extra</div>
                    <div>❌ Travel charges</div>
                    <div>❌ Setup fees</div>
                  </div>
                </TextSelectionUnderline>
              </div>

              {/* Our Price */}
              <div className="our-price bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-500 rounded-xl p-8 relative overflow-hidden shadow-xl">
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-black px-4 py-2 text-sm font-bold transform rotate-12 translate-x-2 -translate-y-2 shadow-lg">
                  BEST DEAL!
                </div>
                <TextSelectionUnderline>
                  <h4 className="text-xl font-bold text-green-800 mb-4">Affordable Audio</h4>
                  <div className="text-5xl font-bold text-green-600 mb-4">${ourPrice}</div>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>✅ All-inclusive pricing</div>
                    <div>✅ Equipment included</div>
                    <div>✅ Free Perth metro travel</div>
                    <div>✅ Professional setup</div>
                  </div>
                </TextSelectionUnderline>
              </div>
            </div>

            <div className="savings-highlight mt-10 p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl shadow-xl">
              <TextSelectionUnderline>
                <div className="text-3xl font-bold text-yellow-800 mb-4">
                  You Save: ${competitorPrice - ourPrice}!
                </div>
                <p className="text-yellow-700 text-lg">
                  That's a <strong>{Math.round(((competitorPrice - ourPrice) / competitorPrice) * 100)}% saving</strong> compared to our competitors!
                </p>
              </TextSelectionUnderline>
            </div>

            <div className="mt-8 space-y-4">
              <MorphingButton 
                morphType="elastic"
                className="final-cta w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-6 px-8 rounded-xl text-2xl shadow-2xl"
              >
                Book Now for ${ourPrice}
              </MorphingButton>
              <TextSelectionUnderline>
                <p className="text-sm text-gray-600">
                  Price valid for 48 hours • No hidden fees • 100% satisfaction guarantee
                </p>
              </TextSelectionUnderline>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-orange-400 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-red-400 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-3 relative overflow-hidden">
        <div 
          className="progress-bar bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-3 transition-all duration-1000 ease-out relative"
          style={{ width: '0%' }}
        >
          <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <AnimatedFormField delay={0.1}>
              <TextSelectionUnderline>
                <h1 className="text-5xl font-bold text-gray-800 mb-4">
                  {currentStepData.title}
                </h1>
              </TextSelectionUnderline>
            </AnimatedFormField>
            
            <AnimatedFormField delay={0.2}>
              <TextSelectionUnderline>
                <p className="text-2xl text-gray-600">
                  {currentStepData.subtitle}
                </p>
              </TextSelectionUnderline>
            </AnimatedFormField>
            
            <AnimatedFormField delay={0.3}>
              <div className="mt-6 text-lg text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>
            </AnimatedFormField>
          </div>

          {/* Content with FLIP transitions */}
          <FLIPStepTransition
            currentStep={currentStep}
            direction={transitionDirection}
            onTransitionComplete={() => setTransitionDirection(null)}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-10 mb-12 backdrop-blur-sm bg-opacity-95">
              {currentStepData.content}
            </div>
          </FLIPStepTransition>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <MorphingButton
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="secondary"
              morphType="magnetic"
              className="flex items-center text-lg px-8 py-4"
            >
              <ChevronLeft className="w-6 h-6 mr-2" />
              Back
            </MorphingButton>

            <MorphingButton
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              variant="primary"
              morphType="elastic"
              className="flex items-center shadow-2xl text-lg px-8 py-4"
            >
              {currentStep === steps.length - 2 ? 'Get My Quote' : 'Next'}
              <ChevronRight className="w-6 h-6 ml-2" />
            </MorphingButton>
          </div>
        </div>
      </div>

      {/* Floating testimonial */}
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <div className="floating-testimonial fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl p-6 max-w-xs border-l-4 border-yellow-500 backdrop-blur-sm bg-opacity-95">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-yellow-600" />
            </div>
            <div>
              <TextSelectionUnderline>
                <p className="text-sm font-bold text-gray-800">Sarah M.</p>
                <p className="text-xs text-gray-600 mt-1">"Saved $800 on my wedding audio!"</p>
              </TextSelectionUnderline>
              <div className="flex text-yellow-400 mt-2">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceCalculator;