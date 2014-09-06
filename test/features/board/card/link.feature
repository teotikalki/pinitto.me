Feature: Card link

Background:

    Given a created board    
    When I create a card
    
Scenario: When I the link button I see a link modal

    When I click for card link
    Then I see the link modal
    And the expected link modal elements

Scenario: I can use the close button to close the modal

    When I click for card link
    And I see the link modal
    And I click the 'Close' button
    Then the card link modal is closed

Scenario: I can use the '×' to close the modal

    When I click for card link
    And I see the link modal
    And I click element '#card-link-modal .modal-header button'
    Then the card link modal is closed