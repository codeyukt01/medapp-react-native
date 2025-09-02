# SSE (Server-Sent Events) Integration for Real-time Order Updates

This document describes the SSE integration that provides real-time updates for order management using Server-Sent Events instead of WebSockets.

## Dependencies

This implementation uses a custom SSE implementation built with fetch and ReadableStream, as React Native doesn't have native `EventSource` support.

## Overview

The app now uses SSE to receive real-time updates for orders instead of relying solely on API calls. This provides instant updates when orders are created, updated, or deleted.

## Implementation

### 1. SSE Service (`src/api/sse.ts`)

The `SSEService` class manages the SSE connection:

```typescript
// Connect to SSE server
sseService.connect();

// Listen for order updates
sseService.onOrderUpdate((data) => {
  console.log(`Order ${data.event}:`, data.order);
  // Update UI here
});
```

### 2. Custom Hook (`src/hooks/useSSE.ts`)

A reusable hook that manages SSE connections and event listeners:

```typescript
const { isConnected } = useSSE({
  onOrderUpdate: handleOrderUpdate,
  onOrderCreated: handleOrderCreated,
  onOrderStatusChanged: handleOrderStatusChanged,
});
```

### 3. Screen Integration

Both `HomeScreen` and `OrderScreen` now use the SSE hook for real-time updates:

- **Order Creation**: New orders appear instantly in the list
- **Order Updates**: Order status changes are reflected immediately
- **Order Deletion**: Removed orders disappear from the list

## SSE Events

The following SSE events are handled:

- `order-update`: General order updates (created, updated, deleted)
- `order-created`: New order creation
- `order-status-changed`: Order status changes
- `initial-orders`: Initial orders data when connection is established

## Server Configuration

The SSE client connects to `GET /api/sse/orders?token=<jwt-token>` and receives real-time updates.

## Authentication

The SSE connection includes authentication via the JWT token in the Authorization header and as a query parameter.

## Usage Example

```typescript
// In any component
import { useSSE } from '../hooks/useSSE';

const MyComponent = () => {
  const [orders, setOrders] = useState([]);

  const handleOrderUpdate = (data) => {
    if (data.event === 'created') {
      setOrders(prev => [data.order, ...prev]);
    } else if (data.event === 'updated') {
      setOrders(prev => prev.map(order => 
        order.orderid === data.order.orderid ? data.order : order
      ));
    }
  };

  const { isConnected } = useSSE({
    onOrderUpdate: handleOrderUpdate,
    onOrderCreated: (data) => setOrders(prev => [data.order, ...prev]),
    onOrderStatusChanged: (data) => {
      // Handle status changes
    },
  });

  return (
    <View>
      <Text>Connection: {isConnected ? 'Live' : 'Offline'}</Text>
      {/* Your component content */}
    </View>
  );
};
```

## Advantages over WebSockets

1. **Simpler Protocol**: SSE is built on top of HTTP, making it easier to implement and debug
2. **Automatic Reconnection**: Browsers handle SSE reconnection automatically
3. **Firewall Friendly**: SSE works through most firewalls and proxies
4. **Server-Side Simpler**: No need for complex WebSocket server implementation
5. **Fallback Support**: Easy to fall back to REST API calls if SSE fails

## Connection Status

The app displays connection status indicators:
- **Live Updates**: When SSE is connected and receiving real-time data
- **Offline**: When SSE is disconnected or not receiving updates

## Error Handling

- Automatic reconnection with exponential backoff
- Fallback to REST API calls if SSE fails
- Graceful degradation when network issues occur 