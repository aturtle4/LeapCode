FROM python:3.13-alpine

WORKDIR /app

COPY requirements.txt .
# Use relative path instead of absolute path
# Add this before pip install if needed
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .
CMD [ "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload" ]