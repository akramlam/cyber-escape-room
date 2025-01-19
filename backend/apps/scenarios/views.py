from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

class ScenarioViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ScenarioSerializer
    
    def get_queryset(self):
        return Scenario.objects.filter(is_active=True) 