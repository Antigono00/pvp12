// src/components/battle/CreatureCard.jsx - Enhanced with Animation Support
import React, { useState, useEffect } from 'react';
import { getRarityColor } from '../../utils/uiHelpers';
import { getPlaceholderForForm } from '../../utils/enemyPlaceholders';

const CreatureCard = ({ 
  creature, 
  isEnemy = false, 
  onClick, 
  isSelected = false, 
  isTarget = false,
  disabled = false,
  simplified = false,
  // Animation-related props
  isAnimating = false,
  isTargetOfAnimation = false,
  animationType = null,
  // Data attributes for DOM targeting
  dataPower,
  dataDefense
}) => {
  const [imageError, setImageError] = useState(false);
  const [showAttackType, setShowAttackType] = useState(false);
  
  if (!creature) return null;
  
  // Reset image error when creature changes
  useEffect(() => {
    setImageError(false);
  }, [creature.id, creature.image_url]);
  
  // Show attack type indicator briefly when hovering or during animations
  useEffect(() => {
    if (isAnimating || isTargetOfAnimation || isSelected || isTarget) {
      setShowAttackType(true);
      
      // Hide after a delay unless still selected
      const timeout = setTimeout(() => {
        if (!isSelected && !isTarget) {
          setShowAttackType(false);
        }
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [isAnimating, isTargetOfAnimation, isSelected, isTarget]);
  
  const handleImageError = () => {
    console.log(`Image failed to load for ${creature.species_name}, using placeholder`);
    setImageError(true);
  };
  
  const getImageSrc = () => {
    if (imageError || !creature.image_url) {
      return getPlaceholderForForm(creature.form || 0);
    }
    return creature.image_url;
  };
  
  const healthPercentage = creature.battleStats 
    ? (creature.currentHealth / creature.battleStats.maxHealth) * 100 
    : 100;
    
  const healthStatus = healthPercentage <= 25 ? 'critical' : healthPercentage <= 50 ? 'low' : 'normal';
  
  // Determine primary attack type for visual indicators
  const primaryAttackType = creature.battleStats?.physicalAttack > creature.battleStats?.magicalAttack 
    ? 'physical' 
    : 'magical';
  
  // Get specialty stats for highlighting
  const specialtyStats = creature.specialty_stats || [];
  
  // Build CSS classes including animation states
  const cardClasses = [
    'creature-card',
    isEnemy && 'enemy',
    isSelected && 'selected',
    isTarget && 'target',
    creature.isDefending && 'defending',
    disabled && 'disabled',
    // Animation classes
    isAnimating && 'animating',
    isAnimating && animationType && `animating-${animationType}`,
    isTargetOfAnimation && 'animation-target',
    isTargetOfAnimation && animationType && `animation-target-${animationType}`,
    // Attack type indicator
    primaryAttackType === 'physical' && 'physical-attacker',
    primaryAttackType === 'magical' && 'magical-attacker',
    showAttackType && 'show-attack-type'
  ].filter(Boolean).join(' ');
  
  const handleClick = (e) => {
    if (!disabled && onClick) {
      e.stopPropagation();
      onClick(creature, isEnemy);
    }
  };
  
  return (
    <div 
      className={cardClasses}
      onClick={handleClick}
      data-rarity={creature.rarity}
      data-id={creature.id}
      data-power={dataPower || Math.max(
        creature.battleStats?.physicalAttack || 0,
        creature.battleStats?.magicalAttack || 0
      )}
      data-defense={dataDefense || Math.max(
        creature.battleStats?.physicalDefense || 0,
        creature.battleStats?.magicalDefense || 0
      )}
      data-attack-type={primaryAttackType}
      data-health-status={healthStatus}
    >
      {/* Header */}
      <div className="creature-card-header">
        <span className="creature-name">{creature.species_name}</span>
        <span className="creature-form">F{creature.form || 0}</span>
      </div>
      
      {/* Image */}
      <div className="creature-image-container">
        <img 
          src={getImageSrc()}
          alt={creature.species_name}
          className={`creature-image ${imageError ? 'image-fallback' : ''}`}
          onError={handleImageError}
        />
        
        {/* Attack Type Indicator - Shows during hover or animations */}
        <div className={`attack-type-indicator ${primaryAttackType}`}>
          <span className="attack-icon">
            {primaryAttackType === 'physical' ? '⚔️' : '✨'}
          </span>
        </div>
      </div>
      
      {/* Footer with health and stats - ALWAYS showing stats regardless of simplified prop */}
      <div 
        className="creature-card-footer"
        data-power={dataPower}
        data-defense={dataDefense}
      >
        {/* Health Bar - Always visible */}
        <div className="health-bar-container">
          <div 
            className="health-bar" 
            style={{ width: `${healthPercentage}%` }}
            data-health={healthStatus}
          />
          <span className="health-text">
            {creature.currentHealth}/{creature.battleStats?.maxHealth || 0}
          </span>
        </div>
        
        {/* Stats Grid - Always visible now, regardless of simplified prop */}
        {creature.battleStats && (
          <div className="mini-stats">
            <div className={`mini-stat ${specialtyStats.includes('strength') ? 'primary' : ''} ${primaryAttackType === 'physical' ? 'highlight' : ''}`}>
              <span className="stat-icon">⚔️</span>
              <span className="stat-value">{creature.battleStats.physicalAttack}</span>
            </div>
            <div className={`mini-stat ${specialtyStats.includes('magic') ? 'primary' : ''} ${primaryAttackType === 'magical' ? 'highlight' : ''}`}>
              <span className="stat-icon">✨</span>
              <span className="stat-value">{creature.battleStats.magicalAttack}</span>
            </div>
            <div className={`mini-stat ${specialtyStats.includes('speed') ? 'primary' : ''}`}>
              <span className="stat-icon">⚡</span>
              <span className="stat-value">{creature.battleStats.initiative}</span>
            </div>
            <div className={`mini-stat ${specialtyStats.includes('stamina') ? 'primary' : ''}`}>
              <span className="stat-icon">🛡️</span>
              <span className="stat-value">{creature.battleStats.physicalDefense}</span>
            </div>
            <div className={`mini-stat ${specialtyStats.includes('energy') ? 'primary' : ''}`}>
              <span className="stat-icon">🔮</span>
              <span className="stat-value">{creature.battleStats.magicalDefense}</span>
            </div>
            <div className="mini-stat special-slot">
              {creature.rarity === 'Legendary' && <span className="rarity-indicator">★</span>}
              {creature.rarity === 'Epic' && <span className="rarity-indicator">◆</span>}
              {creature.rarity === 'Rare' && <span className="rarity-indicator">♦</span>}
            </div>
          </div>
        )}
      </div>
      
      {/* Status Effects */}
      {creature.activeEffects && creature.activeEffects.length > 0 && (
        <div className="status-effects">
          {creature.activeEffects.map((effect, index) => (
            <div 
              key={index} 
              className={`status-icon ${effect.type}`}
              title={effect.name}
            >
              {effect.type === 'buff' ? '↑' : '↓'}
            </div>
          ))}
        </div>
      )}
      
      {/* Defending Shield */}
      {creature.isDefending && (
        <div className="defending-shield">🛡️</div>
      )}
    </div>
  );
};

export default CreatureCard;
