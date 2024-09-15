from django.shortcuts import HttpResponse
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Problem, Counter, Job
from bson.objectid import ObjectId
from django.views.decorators.csrf import csrf_exempt
import json
from  .tasks import add_job_to_queue
from .generate_file import generate_file
from django.utils import timezone
import urllib.parse
import asyncio

@require_http_methods(["GET"])
def get_job_status(request):
    job_id = request.GET.get('id')
    print("status requested for", job_id)

    if not job_id:
        return JsonResponse(
            {'success': False, 'error': "missing id query param"},
            status=400
        )

    #try:
    # Convert job_id to ObjectId
    object_id = ObjectId(job_id)

    # Fetch the job from MongoDB
    job = Job.find_one({'_id': object_id})

    if job is None:
        return JsonResponse(
            {'success': False, 'error': "invalid job id"},
            status=404
        )
    job['_id'] = str(job['_id'])
    # Return job details
    return JsonResponse({'success': True, 'job': job}, status=200)

    # except Exception as e:
    #    return JsonResponse(
    #        {'success': False, 'error': str(e)},
    #        status=400
    #    )

@csrf_exempt
def run(request):
    if request.method == 'POST':
            #try:

            # language = request.POST.get('language')
            # code = request.POST.get('code')
            # problem_id = request.POST.get('problemId', None)


            print(request.body)
            body = request.body.decode('utf-8')
            data = json.loads(body)
            print(data)
            language = data.get('language')
            code = data.get('code')
            problem_id = data.get('problemId', None)

            is_test_case = bool(problem_id)
            print('on view',language, code, problem_id)
            if not language or not code:
                return JsonResponse({'error': 'Code or language is empty'}, status=400)
            

            # Generate file and create job
            file_path =  generate_file(language, code, problem_id)
            job = Job.insert_one({
                'language':language,
                'code':code,
                'file_path':file_path,
                'problem_id':problem_id,
                'created_at':timezone.now()
            })
            job_id = job.inserted_id

            print(str(job_id))
            # Add job to Celery queue
            add_job_to_queue(str(job_id), is_test_case)

            return JsonResponse({'success': True, 'jobId': str(job_id)}, status=201)

        #except Exception as e:
        #return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid method'}, status=405)

def index(request):
  return HttpResponse("hello, world.")

def get_problem(request):
    problem_id = request.GET.get('id')  # Capture 'id' from query parameter
    
    if not ObjectId.is_valid(problem_id):
        return JsonResponse({"error": "Invalid problem ID"}, status=400)

    # Connect to the MongoDB collection
    

    # Query the MongoDB collection
    problem = Problem.find_one({"_id": ObjectId(problem_id)})

    if problem:
        # Convert ObjectId to string for JSON serialization
        problem['_id'] = str(problem['_id'])
        return JsonResponse(problem, status=200)
    else:
        return JsonResponse({"error": "Problem not found"}, status=404)
    
'''
def get_problem(request, problem_id):
    if not ObjectId.is_valid(problem_id):
        return JsonResponse({"error": "Invalid problem ID"}, status=400)

    # Connect to the MongoDB collection
  

    # Query the MongoDB collection
    problem = Problem.find_one({"_id": ObjectId(problem_id)})

    if problem:
        # Convert ObjectId to string for JSON serialization
        problem['_id'] = str(problem['_id'])
        return JsonResponse(problem, status=200)
    else:
        return JsonResponse({"error": "Problem not found"}, status=404)

'''
'''
router.get("/get-problem", async (req, res) => {
  const problemId = req.query.id;
  const problem = await Problem.findById(problemId);
  console.log(problem);
  return res.json(problem);
});
'''


def get_all_problems(request):
  try:
    
    problem_cursor = Problem.find({})
    problems = []
    for document in problem_cursor:
        # Convert ObjectId to string
        if '_id' in document:
            document['_id'] = str(document['_id'])
        problems.append(document)

    return JsonResponse(problems, safe=False)
  
  except Exception as e:
    return JsonResponse({"error":e})


def get_next_sequence_value():

   
    
    # Find the document with counter_name = 'problem' and increment sequence_value
    sequence_document = Counter.find_one_and_update(
        {"counter_name": "problem"},  # Find the counter by name
        {"$inc": {"sequence_value": 1}},  # Increment the sequence value
        return_document=True  # Return the updated document
    )

    # Return the updated sequence_value
    return sequence_document["sequence_value"]

@csrf_exempt  # To allow POST requests without CSRF token (for development)
def add_problem(request):
    if request.method == 'POST':
        try:
            # Parse the JSON body
            data = json.loads(request.body)

            # Extract the fields from the request body
            problem_name = data.get('problemName')
            problem_description = data.get('problemDescription')
            test_cases_count = data.get('testCasesCount')
            test_case_input = data.get('testCaseInput')
            test_case_expected_output = data.get('testCaseExpectedOutput')

            # Check for required fields
            if not problem_name or not problem_description:
                return JsonResponse({
                    "status": "error",
                    "message": "Either name or description is empty!"
                }, status=400)

            # Connect to the MongoDB collection

            # Create the problem document
            problem = {
                "name": problem_name,
                "description": problem_description,
                "testCasesCount": test_cases_count,
                "testCaseInputString": test_case_input,
                "testCaseExpectedOutputString": test_case_expected_output,
                "problemNumber": get_next_sequence_value()
            }

            # Insert the problem into the collection
            result = Problem.insert_one(problem)
            problem_id = str(result.inserted_id)

            # Return success response
            return JsonResponse({
                "status": "success",
                "message": f"Problem added with id: {problem_id}"
            }, status=201)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=500)

    # If not POST, return method not allowed
    return JsonResponse({
        "status": "error",
        "message": "Method not allowed"
    }, status=405)


