#!/bin/bash

# Status and Logs Script for Trusttech Dashboard

case "$1" in
"status")
    echo "📊 Container Status:"
    docker-compose -f docker-compose.prod.yml ps
    ;;
"logs")
    echo "📝 Application Logs:"
    docker-compose -f docker-compose.prod.yml logs -f app
    ;;
"stop")
    echo "🛑 Stopping application..."
    docker-compose -f docker-compose.prod.yml down
    echo "✅ Application stopped!"
    ;;
"restart")
    echo "🔄 Restarting application..."
    docker-compose -f docker-compose.prod.yml restart
    echo "✅ Application restarted!"
    ;;
"health")
    echo "🏥 Health Check:"
    curl -f http://localhost:3000/api/health 2>/dev/null && echo "✅ Application is healthy!" || echo "❌ Application is not responding!"
    ;;
*)
    echo "Usage: $0 {status|logs|stop|restart|health}"
    echo ""
    echo "  status   - Show container status"
    echo "  logs     - Show application logs (follow mode)"
    echo "  stop     - Stop the application"
    echo "  restart  - Restart the application"
    echo "  health   - Check application health"
    exit 1
    ;;
esac
