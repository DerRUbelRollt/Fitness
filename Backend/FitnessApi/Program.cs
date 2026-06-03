using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using FitnessApi.Data;
using FitnessApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new string[] { };
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Add Entity Framework
builder.Services.AddDbContext<FitnessDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register services
builder.Services.AddScoped<IActivityService, ActivityService>();
builder.Services.AddScoped<IGoalService, GoalService>();
builder.Services.AddScoped<IHabitService, HabitService>();
builder.Services.AddScoped<ICustomActivityService, CustomActivityService>();
builder.Services.AddScoped<IUserService, UserService>();

// Add controllers and Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Migrate database on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FitnessDbContext>();
    await db.Database.MigrateAsync();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
