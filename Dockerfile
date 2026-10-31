FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8888
ENV HOST=0.0.0.0

EXPOSE 8888

CMD ["python", "app.py"]
