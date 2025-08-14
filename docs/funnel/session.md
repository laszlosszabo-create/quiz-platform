# Session Management Documentation

## Overview

Client tokens are used to track anonymous user sessions throughout the quiz funnel, enabling autosave functionality and progress tracking without requiring authentication.

## Client Token Lifecycle

### Generation
Client tokens are generated using the format:
```
client_{timestamp}_{random_string}
```

Example: `client_1692012345678_abc123def`

### Storage
- **Location**: Browser's `localStorage`
- **Key**: `quiz_client_token`
- **Persistence**: Survives browser sessions and page refreshes
- **Scope**: Per domain/subdomain

### Expiration
- **Lifespan**: 24 hours from creation
- **Auto-refresh**: New token generated if expired
- **Cleanup**: Expired tokens automatically replaced

## Implementation

### Client Token Utilities

```typescript
// Generate new token
const token = generateClientToken()

// Get or create token from localStorage
const token = getClientToken()

// Get valid token (creates new if expired)
const token = getValidClientToken()

// Clear token (logout/reset)
clearClientToken()

// Check if token is expired
const expired = isClientTokenExpired(token)
```

### Session Creation Flow

1. User lands on quiz page
2. `getClientToken()` called to get/create token
3. Token sent to `/api/quiz/session` to create session record
4. Session ID returned and used for all subsequent tracking

### Autosave Mechanism

1. User answers questions
2. Every 2nd answer triggers autosave
3. Answers sent to `/api/quiz/session` PATCH endpoint
4. Session state updated in database

### Data Associated with Sessions

**Sessions Table Fields:**
- `id`: UUID session identifier
- `quiz_id`: Associated quiz
- `lead_id`: Linked lead (after email submission)
- `lang`: User's language preference
- `state`: 'started' | 'completed'
- `answers`: User's quiz responses (JSONB)
- `scores`: Calculated scores (JSONB)
- `result_snapshot`: AI-generated results (JSONB)
- `client_token`: Anonymous user identifier
- `created_at`: Session start time
- `updated_at`: Last activity time

## Security Considerations

### Privacy
- Client tokens contain no personal information
- Tokens are not linked to user identity until email submission
- Anonymous browsing fully supported

### Data Protection
- No cookies used (localStorage only)
- Tokens automatically expire
- No cross-site tracking capability
- GDPR compliant (anonymous until email opt-in)

### Validation
- Server validates token format
- Expired tokens rejected
- Rate limiting on session creation
- RLS policies enforce quiz-specific access

## Error Handling

### Token Issues
- **Invalid format**: Generate new token
- **Expired token**: Auto-refresh with new token
- **Missing localStorage**: Fallback to memory-only token
- **Storage errors**: Graceful degradation

### Session Issues
- **Session not found**: Create new session
- **Network errors**: Retry with exponential backoff
- **Validation errors**: Log and continue without autosave

## Performance Optimization

### Caching
- Tokens cached in memory during page session
- Validation results cached to avoid repeated checks
- localStorage access minimized

### Network Efficiency
- Batch autosave requests (every 2 questions)
- Debounced session updates
- Silent error handling to avoid blocking UI

## Monitoring & Analytics

### Session Metrics
- Session duration tracking
- Completion rates by session
- Drop-off points identification
- Answer frequency analysis

### Token Metrics
- Token generation rate
- Expiration patterns
- Storage success rate
- Cross-session continuity

## Cleanup & Maintenance

### Automatic Cleanup
- Expired tokens auto-replaced
- Old sessions marked for archival
- Orphaned data identified and flagged

### Manual Cleanup
```typescript
// Clear all quiz data for user
clearClientToken()
localStorage.removeItem('quiz_progress')

// Admin cleanup of old sessions
// (Server-side maintenance script)
```

## Integration Points

### Quiz Flow Integration
1. **Landing Page**: Token generation/retrieval
2. **Quiz Page**: Session creation, autosave
3. **Email Gate**: Link token to lead
4. **Result Page**: Session completion, AI generation

### API Integration
- `POST /api/quiz/session`: Create new session
- `PATCH /api/quiz/session`: Update session (autosave)
- `GET /api/quiz/session/:id`: Retrieve session data

### Tracking Integration
- All tracking events include session_id
- Anonymous analytics until email submission
- Conversion attribution via session continuity

## Best Practices

### Development
- Always validate tokens before use
- Handle storage errors gracefully
- Test with disabled localStorage
- Implement proper fallbacks

### Production
- Monitor token generation rates
- Set up alerts for high failure rates
- Regular cleanup of expired sessions
- Performance monitoring of autosave

### Privacy
- Document data retention policies
- Implement data deletion workflows
- Respect user privacy preferences
- Provide clear opt-out mechanisms
