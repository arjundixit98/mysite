import os
from uuid import uuid4
from polls.models import Problem
# Directory paths
codes_dir = os.path.join(os.getcwd(), "codes")
test_cases_dir = os.path.join(os.getcwd(), "testcases")

# Ensure directories exist
if not os.path.exists(codes_dir):
    os.makedirs(codes_dir)
if not os.path.exists(test_cases_dir):
    os.makedirs(test_cases_dir)

def generate_test_case_file(problem_id, job_id):
    # Create test case files based on problem_id
    try:
        problem = Problem.objects.get(id=problem_id)
        test_case_input = problem.test_case_input_string
        test_case_output = problem.test_case_expected_output_string
    except Problem.DoesNotExist:
        raise ValueError("Problem not found")

    input_file = f"{job_id}_input.txt"
    output_file = f"{job_id}_output.txt"
    input_file_path = os.path.join(test_cases_dir, input_file)
    output_file_path = os.path.join(test_cases_dir, output_file)

    with open(input_file_path, 'w') as f:
        f.write(test_case_input)

    with open(output_file_path, 'w') as f:
        f.write(test_case_output)

def generate_file(language, code, problem_id=None):
    job_id = str(uuid4())
    if problem_id:
        generate_test_case_file(problem_id, job_id)

    file_name = f"{job_id}.{language}"
    file_path = os.path.join(codes_dir, file_name)
    
    with open(file_path, 'w') as f:
        f.write(code)
    
    return file_path