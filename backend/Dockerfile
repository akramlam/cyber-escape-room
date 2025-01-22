FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create directories for static files
RUN mkdir -p /app/static /app/staticfiles

# Copy project files
COPY . .

# Run migrations
RUN python manage.py migrate

# Collect static files
RUN python manage.py collectstatic --noinput --clear

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] 