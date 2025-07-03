from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_file, name='upload_file'),
    path('list/', views.list_files, name='list_files'),
    path('download/<uuid:file_id>/', views.generate_download_link, name='generate_download_link'),
    path('secure-download/<str:token>/', views.secure_download, name='secure_download'),
    path('delete/<uuid:file_id>/', views.delete_file, name='delete_file'),
    path('detail/<uuid:file_id>/', views.file_detail, name='file_detail'),
]