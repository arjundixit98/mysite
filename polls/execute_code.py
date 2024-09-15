import os
import subprocess
import asyncio

# Directory paths
outputs_dir = os.path.join(os.getcwd(), "outputs")
test_cases_dir = os.path.join(os.getcwd(), "testcases")

# Ensure directories exist
if not os.path.exists(outputs_dir):
    os.makedirs(outputs_dir)

def execute_code(language, file_path, is_test_case=False):
    if language == "cpp":
        return  execute_cpp(file_path, is_test_case)
    elif language == "py":
        return  execute_py(file_path)

def execute_py(file_path):
    command = ["python3", file_path]
    
    try:
        result =  subprocess.run(command, capture_output=True, text=True)
        print(f'py output is {result.stdout}')
        if result.returncode != 0:
            return {"status": "error", "output": result.stderr}

        return {"status": "success", "output": result.stdout}
    except Exception as e:
        return {"status": "error", "output": str(e)}

def execute_cpp(file_path, is_test_case=False):
    job_id = os.path.basename(file_path).split(".")[0]
    output_path = os.path.join(outputs_dir, f"{job_id}.out")

    try:
        compile_command = ["g++", file_path, "-o", output_path]
        compile_result = subprocess.run(compile_command, capture_output=True, text=True)

        if compile_result.returncode != 0:
            return {"status": "error", "output": compile_result.stderr}

        run_command = [output_path]

        if is_test_case:
            test_case_input_file_path = os.path.join(test_cases_dir, f"{job_id}_input.txt")
            with open(test_case_input_file_path, 'r') as test_input:
                run_result = subprocess.run(run_command, stdin=test_input, capture_output=True, text=True)
        else:
            run_result = subprocess.run(run_command, capture_output=True, text=True)

        if run_result.returncode != 0:
            return {"status": "error", "output": run_result.stderr}

        return {"status": "success", "output": run_result.stdout}
    except Exception as e:
        return {"status": "error", "output": str(e)}