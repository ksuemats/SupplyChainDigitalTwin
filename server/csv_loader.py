import csv
import math
import random
from datetime import datetime, timedelta


def load_supply_chain_csv(csv_path: str):
    """
    Reads the CSV file and returns a list of records (dicts).
    Each row from the CSV is turned into a dictionary with keys matching the CSV headers.
    """
    data = []
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            data.append(row)
    return data


def compute_metrics_from_csv(data):
    """
    Takes the list of CSV rows and computes aggregated metrics for the dashboard.
    Returns a dictionary of the metrics that can be fed into store.metrics.
    """
    # For example, let's assume your CSV has columns:
    # ID, Name, Type, Region, Active, RiskScore, Bottleneck, Throughput, DelayedShipments, Health, Timestamp
    total_nodes = len(data)
    active_nodes = sum(1 for row in data if row["Active"].upper() == "TRUE")
    
    # Convert RiskScore, Throughput, DelayedShipments, and Health to numeric
    # and compute some aggregated values:
    risk_scores = []
    throughputs = []
    delayed_shipments = []
    health_scores = []

    for row in data:
        try:
            risk_scores.append(float(row["RiskScore"]))
        except:
            pass

        try:
            throughputs.append(float(row["Throughput"]))
        except:
            pass

        try:
            delayed_shipments.append(float(row["DelayedShipments"]))
        except:
            pass

        try:
            health_scores.append(float(row["Health"]))
        except:
            pass

    avg_risk_score = sum(risk_scores) / len(risk_scores) if risk_scores else 0
    total_throughput = sum(throughputs) if throughputs else 0
    total_delayed_shipments = sum(delayed_shipments) if delayed_shipments else 0
    avg_health = sum(health_scores) / len(health_scores) if health_scores else 0

    # Bottlenecks: count how many rows have Bottleneck == "Yes"
    bottlenecks = sum(1 for row in data if row["Bottleneck"].upper() == "YES")

    # Return a dict matching your store.metrics structure
    return {
        "totalNodes": total_nodes,
        "activeNodes": active_nodes,
        "averageRiskScore": avg_risk_score,
        "throughput": total_throughput,
        "bottlenecks": bottlenecks,
        "delayedShipments": total_delayed_shipments,
        # "health" is sometimes an average or an overall system status,
        # but you can store it in a custom field or incorporate it into "averageRiskScore" if you like.
    }

def generate_risk_trend(avg_risk_score):
    """
    Example function to generate risk trend data over time,
    but base it around the CSV's average risk score.
    """
    now = datetime.now()
    trend_data = []
    for i in range(20):
        # Variation around the average
        variation = math.sin(i / 3) * 5
        noise = (random.random() - 0.5) * 3
        risk_val = max(0, min(100, avg_risk_score + variation + noise))
        trend_data.append({
            "timestamp": (now - timedelta(minutes=5 * (19 - i))).isoformat(),
            "riskScore": risk_val
        })
    return trend_data