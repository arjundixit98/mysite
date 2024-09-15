from django.urls import path

from . import views

urlpatterns = [
  path("", views.index, name="index"),
  path("problems/get-problems",views.get_all_problems,name="problems"),
  path('problems/get-problem', views.get_problem, name='get_problem'),
  path('problems/add-problem', views.add_problem, name='add_problem'),
  path('run', views.run, name='run'),
  path('status', views.get_job_status, name='status')
]