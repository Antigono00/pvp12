// src/components/battle/ActionPanel.jsx - Enhanced with Animation Feedback
import React, { useState } from 'react';
import ToolSpellModal from './ToolSpellModal';

const ActionPanel = ({
  selectedCreature,
  targetCreature,
  availableActions = [],
  onAction,
  disabled = false,
  availableTools = [],
  availableSpells = []
}) => {
  const [showToolModal, setShowToolModal] = useState(false);
  const [showSpellModal, setShowSpellModal] = useState(false);
  const [recentAction, setRecentAction] = useState(null);
  
  // Empty state - no creature selected
  if (!selectedCreature) {
    return (
      <div className="action-panel">
        <div className="action-info">
          Select a creature to perform actions
        </div>
      </div>
    );
  }
  
  // Get creature info for display
  const isInHand = availableActions.includes('deploy');
  const isOnField = !isInHand;
  const displayName = selectedCreature.species_name;
  
  // Handle button click with animation feedback
  const handleActionClick = (actionType, additionalData = {}) => {
    if (disabled) return;
    
    // Set recent action for animation feedback
    setRecentAction(actionType);
    
    // Clear after animation
    setTimeout(() => setRecentAction(null), 500);
    
    switch (actionType) {
      case 'deploy':
        onAction({ type: 'deploy' }, null, selectedCreature);
        break;
        
      case 'attack':
        if (targetCreature) {
          onAction({ type: 'attack' }, targetCreature, selectedCreature);
        }
        break;
        
      case 'useTool':
        // Show tool modal
        setShowToolModal(true);
        break;
        
      case 'useSpell':
        // Show spell modal
        setShowSpellModal(true);
        break;
        
      case 'defend':
        onAction({ type: 'defend' }, null, selectedCreature);
        break;
        
      case 'endTurn':
        onAction({ type: 'endTurn' });
        break;
        
      default:
        console.log('Unknown action type:', actionType);
    }
  };
  
  // Handle tool selection from modal
  const handleToolSelect = (tool) => {
    setShowToolModal(false);
    onAction({ type: 'useTool', tool }, null, selectedCreature);
  };
  
  // Handle spell selection from modal
  const handleSpellSelect = (spell) => {
    setShowSpellModal(false);
    onAction({ type: 'useSpell', spell }, targetCreature, selectedCreature);
  };
  
  // Button animation class
  const getButtonAnimationClass = (actionType) => {
    return recentAction === actionType ? 'action-btn-animate' : '';
  };
  
  return (
    <div className="action-panel">
      <div className="selected-info">
        <div className="selection-summary">
          <div className="selected-creature">
            Selected: {isInHand ? '🖐️ ' : '🎮 '}{displayName}
          </div>
          
          {targetCreature && (
            <>
              <div className="action-arrow">➡️</div>
              <div className="target-creature">
                Target: {targetCreature.species_name}
              </div>
            </>
          )}
        </div>
        
        {/* Show creature stats summary */}
        {selectedCreature.battleStats && (
          <div className="creature-stats-summary">
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-icon">❤️</span>
                <span className="stat-value">{selectedCreature.currentHealth}</span>
              </div>
              
              <div className="summary-stat">
                <span className="stat-icon">⚔️</span>
                <span className="stat-value">{selectedCreature.battleStats.physicalAttack}</span>
              </div>
              
              <div className="summary-stat">
                <span className="stat-icon">✨</span>
                <span className="stat-value">{selectedCreature.battleStats.magicalAttack}</span>
              </div>
              
              <div className="summary-stat">
                <span className="stat-icon">⚡</span>
                <span className="stat-value">{selectedCreature.battleStats.initiative}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="action-buttons">
        {/* Deploy button (hand only) */}
        {availableActions.includes('deploy') && (
          <button 
            className={`action-btn deploy ${getButtonAnimationClass('deploy')}`}
            onClick={() => handleActionClick('deploy')}
            disabled={disabled}
          >
            <span className="btn-icon">🌟</span> Deploy
          </button>
        )}
        
        {/* Attack button (field only, needs target) */}
        {availableActions.includes('attack') && (
          <button 
            className={`action-btn attack ${getButtonAnimationClass('attack')}`}
            onClick={() => handleActionClick('attack')}
            disabled={disabled || !targetCreature}
          >
            <span className="btn-icon">⚔️</span> Attack
          </button>
        )}
        
        {/* Tool button (field only) */}
        {availableActions.includes('useTool') && (
          <button 
            className={`action-btn special ${getButtonAnimationClass('useTool')}`}
            onClick={() => handleActionClick('useTool')}
            disabled={disabled || availableTools.length === 0}
          >
            <span className="btn-icon">🔧</span> Use Tool ({availableTools.length})
          </button>
        )}
        
        {/* Spell button (field only) */}
        {availableActions.includes('useSpell') && (
          <button 
            className={`action-btn special ${getButtonAnimationClass('useSpell')}`}
            onClick={() => handleActionClick('useSpell')}
            disabled={disabled || availableSpells.length === 0}
          >
            <span className="btn-icon">✨</span> Cast Spell ({availableSpells.length})
          </button>
        )}
        
        {/* Defend button (field only) */}
        {availableActions.includes('defend') && (
          <button 
            className={`action-btn defend ${getButtonAnimationClass('defend')}`}
            onClick={() => handleActionClick('defend')}
            disabled={disabled}
          >
            <span className="btn-icon">🛡️</span> Defend
          </button>
        )}
        
        {/* End Turn button (always available) */}
        <button 
          className={`action-btn end-turn ${getButtonAnimationClass('endTurn')}`}
          onClick={() => handleActionClick('endTurn')}
          disabled={disabled}
        >
          <span className="btn-icon">⏭️</span> End Turn
        </button>
      </div>
      
      {/* Tool Modal */}
      {showToolModal && (
        <ToolSpellModal
          items={availableTools}
          type="tool"
          onSelect={handleToolSelect}
          onClose={() => setShowToolModal(false)}
        />
      )}
      
      {/* Spell Modal */}
      {showSpellModal && (
        <ToolSpellModal
          items={availableSpells}
          type="spell"
          onSelect={handleSpellSelect}
          onClose={() => setShowSpellModal(false)}
        />
      )}
    </div>
  );
};

export default ActionPanel;
