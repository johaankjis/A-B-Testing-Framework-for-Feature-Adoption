"""
Statistical Analysis Engine for A/B Testing Framework
Implements t-tests, z-tests, chi-square tests, and power analysis
"""

import numpy as np
from scipy import stats
from typing import Dict, Tuple, List
import json

def calculate_z_test(control_conversions: int, control_total: int, 
                     treatment_conversions: int, treatment_total: int) -> Dict:
    """
    Perform two-proportion z-test for conversion rate comparison
    
    Args:
        control_conversions: Number of conversions in control group
        control_total: Total users in control group
        treatment_conversions: Number of conversions in treatment group
        treatment_total: Total users in treatment group
    
    Returns:
        Dictionary with test results including p-value, z-score, and confidence intervals
    """
    # Calculate proportions
    p_control = control_conversions / control_total
    p_treatment = treatment_conversions / treatment_total
    
    # Pooled proportion
    p_pooled = (control_conversions + treatment_conversions) / (control_total + treatment_total)
    
    # Standard error
    se = np.sqrt(p_pooled * (1 - p_pooled) * (1/control_total + 1/treatment_total))
    
    # Z-score
    z_score = (p_treatment - p_control) / se
    
    # P-value (two-tailed)
    p_value = 2 * (1 - stats.norm.cdf(abs(z_score)))
    
    # Confidence intervals (95%)
    ci_control = stats.norm.interval(0.95, loc=p_control, 
                                     scale=np.sqrt(p_control * (1-p_control) / control_total))
    ci_treatment = stats.norm.interval(0.95, loc=p_treatment,
                                       scale=np.sqrt(p_treatment * (1-p_treatment) / treatment_total))
    
    # Lift calculation
    lift = ((p_treatment - p_control) / p_control) * 100 if p_control > 0 else 0
    
    return {
        "test_type": "z_test",
        "control_rate": round(p_control * 100, 2),
        "treatment_rate": round(p_treatment * 100, 2),
        "lift_percent": round(lift, 2),
        "z_score": round(z_score, 4),
        "p_value": round(p_value, 4),
        "is_significant": p_value < 0.05,
        "confidence_level": 95,
        "control_ci": [round(ci_control[0] * 100, 2), round(ci_control[1] * 100, 2)],
        "treatment_ci": [round(ci_treatment[0] * 100, 2), round(ci_treatment[1] * 100, 2)]
    }

def calculate_t_test(control_values: List[float], treatment_values: List[float]) -> Dict:
    """
    Perform independent samples t-test for continuous metrics
    
    Args:
        control_values: List of metric values for control group
        treatment_values: List of metric values for treatment group
    
    Returns:
        Dictionary with test results
    """
    # Calculate statistics
    control_mean = np.mean(control_values)
    treatment_mean = np.mean(treatment_values)
    control_std = np.std(control_values, ddof=1)
    treatment_std = np.std(treatment_values, ddof=1)
    
    # Perform t-test
    t_stat, p_value = stats.ttest_ind(treatment_values, control_values)
    
    # Effect size (Cohen's d)
    pooled_std = np.sqrt(((len(control_values)-1)*control_std**2 + 
                          (len(treatment_values)-1)*treatment_std**2) / 
                         (len(control_values) + len(treatment_values) - 2))
    cohens_d = (treatment_mean - control_mean) / pooled_std if pooled_std > 0 else 0
    
    # Confidence intervals
    ci_control = stats.t.interval(0.95, len(control_values)-1, 
                                  loc=control_mean, 
                                  scale=stats.sem(control_values))
    ci_treatment = stats.t.interval(0.95, len(treatment_values)-1,
                                    loc=treatment_mean,
                                    scale=stats.sem(treatment_values))
    
    # Lift calculation
    lift = ((treatment_mean - control_mean) / control_mean) * 100 if control_mean != 0 else 0
    
    return {
        "test_type": "t_test",
        "control_mean": round(control_mean, 2),
        "treatment_mean": round(treatment_mean, 2),
        "control_std": round(control_std, 2),
        "treatment_std": round(treatment_std, 2),
        "lift_percent": round(lift, 2),
        "t_statistic": round(t_stat, 4),
        "p_value": round(p_value, 4),
        "is_significant": p_value < 0.05,
        "cohens_d": round(cohens_d, 3),
        "control_ci": [round(ci_control[0], 2), round(ci_control[1], 2)],
        "treatment_ci": [round(ci_treatment[0], 2), round(ci_treatment[1], 2)]
    }

def calculate_power_analysis(baseline_rate: float, mde: float, 
                             alpha: float = 0.05, power: float = 0.8) -> Dict:
    """
    Calculate required sample size for experiment
    
    Args:
        baseline_rate: Baseline conversion rate (0-1)
        mde: Minimum detectable effect as proportion (e.g., 0.05 for 5%)
        alpha: Significance level (default 0.05)
        power: Statistical power (default 0.8)
    
    Returns:
        Dictionary with sample size requirements
    """
    # Expected treatment rate
    treatment_rate = baseline_rate * (1 + mde)
    
    # Z-scores for alpha and power
    z_alpha = stats.norm.ppf(1 - alpha/2)
    z_beta = stats.norm.ppf(power)
    
    # Pooled proportion
    p_pooled = (baseline_rate + treatment_rate) / 2
    
    # Sample size calculation
    numerator = (z_alpha * np.sqrt(2 * p_pooled * (1 - p_pooled)) + 
                 z_beta * np.sqrt(baseline_rate * (1 - baseline_rate) + 
                                 treatment_rate * (1 - treatment_rate)))**2
    denominator = (treatment_rate - baseline_rate)**2
    
    n_per_variant = int(np.ceil(numerator / denominator))
    
    return {
        "baseline_rate": round(baseline_rate * 100, 2),
        "expected_treatment_rate": round(treatment_rate * 100, 2),
        "mde_percent": round(mde * 100, 2),
        "alpha": alpha,
        "power": power,
        "sample_size_per_variant": n_per_variant,
        "total_sample_size": n_per_variant * 2
    }

def bootstrap_confidence_interval(control_values: List[float], 
                                  treatment_values: List[float],
                                  n_bootstrap: int = 10000) -> Dict:
    """
    Calculate bootstrap confidence intervals for lift
    
    Args:
        control_values: List of values for control group
        treatment_values: List of values for treatment group
        n_bootstrap: Number of bootstrap samples
    
    Returns:
        Dictionary with bootstrap results
    """
    control_array = np.array(control_values)
    treatment_array = np.array(treatment_values)
    
    bootstrap_lifts = []
    
    for _ in range(n_bootstrap):
        # Resample with replacement
        control_sample = np.random.choice(control_array, size=len(control_array), replace=True)
        treatment_sample = np.random.choice(treatment_array, size=len(treatment_array), replace=True)
        
        # Calculate lift
        control_mean = np.mean(control_sample)
        treatment_mean = np.mean(treatment_sample)
        lift = ((treatment_mean - control_mean) / control_mean) * 100 if control_mean != 0 else 0
        bootstrap_lifts.append(lift)
    
    # Calculate percentiles
    ci_lower = np.percentile(bootstrap_lifts, 2.5)
    ci_upper = np.percentile(bootstrap_lifts, 97.5)
    median_lift = np.median(bootstrap_lifts)
    
    return {
        "method": "bootstrap",
        "n_iterations": n_bootstrap,
        "median_lift": round(median_lift, 2),
        "ci_95_lower": round(ci_lower, 2),
        "ci_95_upper": round(ci_upper, 2),
        "is_significant": not (ci_lower <= 0 <= ci_upper)
    }

# Example usage with simulated data
if __name__ == "__main__":
    print("=== A/B Testing Statistical Analysis Engine ===\n")
    
    # Example 1: Z-test for conversion rates
    print("1. Z-Test for Conversion Rates")
    print("-" * 50)
    z_results = calculate_z_test(
        control_conversions=850,
        control_total=10000,
        treatment_conversions=950,
        treatment_total=10000
    )
    print(json.dumps(z_results, indent=2))
    print()
    
    # Example 2: T-test for continuous metrics
    print("2. T-Test for Continuous Metrics (e.g., Time on Page)")
    print("-" * 50)
    np.random.seed(42)
    control_times = np.random.normal(120, 30, 1000).tolist()  # Mean 120s, std 30s
    treatment_times = np.random.normal(135, 32, 1000).tolist()  # Mean 135s, std 32s
    t_results = calculate_t_test(control_times, treatment_times)
    print(json.dumps(t_results, indent=2))
    print()
    
    # Example 3: Power Analysis
    print("3. Power Analysis")
    print("-" * 50)
    power_results = calculate_power_analysis(
        baseline_rate=0.10,  # 10% baseline conversion
        mde=0.08,  # 8% relative lift
        alpha=0.05,
        power=0.80
    )
    print(json.dumps(power_results, indent=2))
    print()
    
    # Example 4: Bootstrap Confidence Intervals
    print("4. Bootstrap Confidence Intervals")
    print("-" * 50)
    bootstrap_results = bootstrap_confidence_interval(
        control_values=control_times[:500],
        treatment_values=treatment_times[:500],
        n_bootstrap=5000
    )
    print(json.dumps(bootstrap_results, indent=2))
    print()
    
    print("=== Analysis Complete ===")
